function session(options){
  var options = options || {}
    , key = options.key || 'connect.sid'
    , store = options.store || new MemoryStore
    , cookie = options.cookie || {}
    , trustProxy = options.proxy
    , storeReady = true
    , rollingSessions = options.rolling || false;

  // notify user that this store is not
  // meant for a production environment
  if ('production' == env && store instanceof MemoryStore) {
    console.warn(warning);
  }

  // generates the new session
  store.generate = function(req){
    req.sessionID = uid(24);
    req.session = new Session(req);
    req.session.cookie = new Cookie(cookie);
  };

  store.on('disconnect', function(){ storeReady = false; });
  store.on('connect', function(){ storeReady = true; });

  return function session(req, res, next) {
    // self-awareness
    if (req.session) return next();

    // Handle connection as if there is no session if
    // the store has temporarily disconnected etc
    if (!storeReady) return debug('store is disconnected'), next();

    // pathname mismatch
    var originalPath = parse(req.originalUrl).pathname;
    if (0 != originalPath.indexOf(cookie.path || '/')) return next();

    // backwards compatibility for signed cookies
    // req.secret is passed from the cookie parser middleware
    var secret = options.secret || req.secret;

    // ensure secret is available or bail
    if (!secret) throw new Error('`secret` option required for sessions');

    var originalHash
      , originalId;

    // expose store
    req.sessionStore = store;

    // grab the session cookie value and check the signature
    var rawCookie = req.cookies[key];

    // get signedCookies for backwards compat with signed cookies
    var unsignedCookie = req.signedCookies[key];

    if (!unsignedCookie && rawCookie) {
      unsignedCookie = utils.parseSignedCookie(rawCookie, secret);
    }

    // set-cookie
    res.on('header', function(){
      if (!req.session) return;
      var cookie = req.session.cookie
        , proto = (req.headers['x-forwarded-proto'] || '').split(',')[0].toLowerCase().trim()
        , tls = req.connection.encrypted || (trustProxy && 'https' == proto)
        , isNew = unsignedCookie != req.sessionID;

      // only send secure cookies via https
      if (cookie.secure && !tls) return debug('not secured');

      // in case of rolling session, always reset the cookie
      if (!rollingSessions) {
      
        // long expires, handle expiry server-side
        if (!isNew && cookie.hasLongExpires) return debug('already set cookie');
  
        // browser-session length cookie
        if (null == cookie.expires) {
          if (!isNew) return debug('already set browser-session cookie');
        // compare hashes and ids
        } else if (originalHash == hash(req.session) && originalId == req.session.id) {
          return debug('unmodified session');
        }
        
      }

      var val = 's:' + signature.sign(req.sessionID, secret);
      val = cookie.serialize(key, val);
      debug('set-cookie %s', val);
      res.setHeader('Set-Cookie', val);
    });

    // proxy end() to commit the session
    var end = res.end;
    res.end = function(data, encoding){
      res.end = end;
      if (!req.session) return res.end(data, encoding);
      debug('saving');
      req.session.resetMaxAge();
      req.session.save(function(err){
        if (err) console.error(err.stack);
        debug('saved');
        res.end(data, encoding);
      });
    };

    // generate the session
    function generate() {
      store.generate(req);
    }

    // get the sessionID from the cookie
    req.sessionID = unsignedCookie;

    // generate a session if the browser doesn't send a sessionID
    if (!req.sessionID) {
      debug('no SID sent, generating session');
      generate();
      next();
      return;
    }

    // generate the session object
    var pause = utils.pause(req);
    debug('fetching %s', req.sessionID);
    store.get(req.sessionID, function(err, sess){
      // proxy to resume() events
      var _next = next;
      next = function(err){
        _next(err);
        pause.resume();
      };

      // error handling
      if (err) {
        debug('error %j', err);
        if ('ENOENT' == err.code) {
          generate();
          next();
        } else {
          next(err);
        }
      // no session
      } else if (!sess) {
        debug('no session found');
        generate();
        next();
      // populate req.session
      } else {
        debug('session found');
        store.createSession(req, sess);
        originalId = req.sessionID;
        originalHash = hash(sess);
        next();
      }
    });
  };
};