CREATE DATABASE  IF NOT EXISTS `vapp1` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `vapp1`;
-- MySQL dump 10.13  Distrib 8.0.16, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: vapp1
-- ------------------------------------------------------
-- Server version	5.7.26-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `customer` (
  `customer_id` int(6) NOT NULL AUTO_INCREMENT,
  `company` varchar(30) DEFAULT NULL,
  `contact` varchar(30) DEFAULT NULL,
  `email` varchar(30) DEFAULT NULL,
  `phone_number` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES (1,'APR','Benjamin','informatique@apr.eu','0478023365'),(2,'APR','Toto','informatique@apr.eu','06369202111'),(3,'APR','Benjamin','benjamin@apr.eu','0659779794'),(4,'APR','Arnaud','alouvel@apr.eu','0478023351'),(5,'Admin','Benjamin Menghini','admin@admin.fr','0478023365'),(6,'TARDY','Yannick Gerphagnon','ygerphagnon@tardy.fr','0478023365'),(7,'GE','Nadine Morelo','n.morello@ge.com','0472685241'),(8,'IVECO','Loic Masson','loic.masson@iveco.com','0475962584'),(9,'ECAR','Marc Thomas','mthomas@ecar.fr','0467856931');
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `decision`
--

DROP TABLE IF EXISTS `decision`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `decision` (
  `decision_id` int(6) NOT NULL AUTO_INCREMENT,
  `rank_Metal` tinyint(1) DEFAULT NULL,
  `rank_plastic` tinyint(1) DEFAULT NULL,
  `first_decision` tinyint(1) DEFAULT NULL,
  `APR_decision` tinyint(1) DEFAULT NULL,
  `TARDY_decision` tinyint(1) DEFAULT NULL,
  `Final_decision` tinyint(1) DEFAULT NULL,
  `APRcomment` varchar(255) DEFAULT NULL,
  `TARDYcomment` varchar(255) DEFAULT NULL,
  `FinalComment` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`decision_id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `decision`
--

LOCK TABLES `decision` WRITE;
/*!40000 ALTER TABLE `decision` DISABLE KEYS */;
INSERT INTO `decision` VALUES (1,2,2,2,NULL,NULL,NULL,NULL,NULL,NULL),(2,2,2,2,NULL,NULL,NULL,NULL,NULL,NULL),(3,2,2,2,NULL,NULL,NULL,NULL,NULL,NULL),(4,2,2,2,2,NULL,NULL,'null',NULL,NULL),(5,2,2,2,NULL,NULL,NULL,NULL,NULL,NULL),(6,2,2,2,NULL,NULL,NULL,NULL,NULL,NULL),(7,2,2,2,NULL,NULL,NULL,NULL,NULL,NULL),(8,2,2,2,NULL,NULL,NULL,NULL,NULL,NULL),(9,2,2,2,NULL,NULL,NULL,NULL,NULL,NULL),(10,2,2,2,NULL,NULL,NULL,NULL,NULL,NULL),(11,2,2,2,NULL,NULL,NULL,NULL,NULL,NULL),(12,2,2,2,NULL,NULL,NULL,NULL,NULL,NULL),(13,2,2,2,NULL,NULL,NULL,NULL,NULL,NULL),(14,2,2,2,NULL,NULL,NULL,NULL,NULL,NULL),(15,2,2,2,NULL,NULL,NULL,NULL,NULL,NULL),(16,2,2,2,NULL,NULL,NULL,NULL,NULL,NULL),(17,2,2,2,NULL,NULL,NULL,NULL,NULL,NULL),(18,2,2,2,NULL,NULL,NULL,NULL,NULL,NULL),(19,2,2,2,NULL,NULL,NULL,NULL,NULL,NULL),(20,2,2,2,NULL,NULL,NULL,NULL,NULL,NULL),(21,2,2,2,NULL,NULL,NULL,NULL,NULL,NULL),(22,2,2,2,NULL,NULL,NULL,NULL,NULL,NULL),(23,2,2,2,NULL,NULL,NULL,NULL,NULL,NULL),(24,2,2,2,NULL,NULL,NULL,NULL,NULL,NULL),(25,2,2,2,NULL,NULL,NULL,NULL,NULL,NULL),(26,2,2,2,NULL,NULL,NULL,NULL,NULL,NULL),(27,2,2,2,NULL,NULL,NULL,NULL,NULL,NULL),(28,2,2,2,NULL,NULL,NULL,NULL,NULL,NULL),(29,2,2,2,NULL,NULL,NULL,NULL,NULL,NULL),(30,2,2,2,NULL,NULL,NULL,NULL,NULL,NULL),(31,2,2,2,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `decision` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documents`
--

DROP TABLE IF EXISTS `documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `documents` (
  `document_id` int(6) NOT NULL AUTO_INCREMENT,
  `document_name` varchar(256) DEFAULT NULL,
  `dcme_3dscan` varchar(30) DEFAULT NULL,
  `adress_id` varchar(256) DEFAULT NULL,
  `feature` int(6) DEFAULT NULL,
  `project` int(6) DEFAULT NULL,
  PRIMARY KEY (`document_id`),
  KEY `feature` (`feature`),
  KEY `project` (`project`),
  CONSTRAINT `documents_ibfk_1` FOREIGN KEY (`feature`) REFERENCES `features` (`feature_id`),
  CONSTRAINT `documents_ibfk_2` FOREIGN KEY (`project`) REFERENCES `project` (`project_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documents`
--

LOCK TABLES `documents` WRITE;
/*!40000 ALTER TABLE `documents` DISABLE KEYS */;
INSERT INTO `documents` VALUES (1,'coiffe.pdf','DCME','workspace://SpacesStore/ef77efc3-8484-40d3-ac4b-c7648f518264',1,1);
/*!40000 ALTER TABLE `documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `features`
--

DROP TABLE IF EXISTS `features`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `features` (
  `feature_id` int(6) NOT NULL AUTO_INCREMENT,
  `label` varchar(256) DEFAULT NULL,
  `attribution` varchar(30) DEFAULT NULL,
  `component` varchar(30) DEFAULT NULL,
  `compound` varchar(30) DEFAULT NULL,
  `ratio` varchar(30) DEFAULT NULL,
  `material` varchar(30) DEFAULT NULL,
  `heat_treatment` varchar(30) DEFAULT NULL,
  `surface_treatment` varchar(30) DEFAULT NULL,
  `width` varchar(30) DEFAULT NULL,
  `lenght` varchar(30) DEFAULT NULL,
  `height` varchar(30) DEFAULT NULL,
  `volume` varchar(30) DEFAULT NULL,
  `manufacturing` varchar(30) DEFAULT NULL,
  `tolerance` varchar(30) DEFAULT NULL,
  `rugosity` varchar(30) DEFAULT NULL,
  `comments` varchar(30) DEFAULT NULL,
  `part_reference` varchar(10) DEFAULT NULL,
  `creation_date` date DEFAULT NULL,
  `modification_date` date DEFAULT NULL,
  `feature_status` varchar(20) DEFAULT NULL,
  `check_label` tinyint(1) DEFAULT NULL,
  `metal` tinyint(1) DEFAULT NULL,
  `plastic` tinyint(1) DEFAULT NULL,
  `project` int(6) DEFAULT NULL,
  `ranking` int(11) DEFAULT NULL,
  PRIMARY KEY (`feature_id`),
  KEY `project` (`project`),
  CONSTRAINT `features_ibfk_1` FOREIGN KEY (`project`) REFERENCES `project` (`project_id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `features`
--

LOCK TABLES `features` WRITE;
/*!40000 ALTER TABLE `features` DISABLE KEYS */;
INSERT INTO `features` VALUES (1,'DT51328','APR','1','1','1','PU','None','None','30','30','30','27000','Turning','0.1','0.8','Bronze Color','COIFFE','0209-07-26',NULL,'Annotated',NULL,0,1,1,NULL),(2,'ARBRE ENTREE DE MVT SECTIONNEUR','APR','1','1','1','PA','undefined','undefined','undefined','undefined','undefined','undefined','Turning','undefined','undefined','undefined','F06P11Z154','2019-09-06',NULL,'Submitted',NULL,0,0,4,74),(3,'ARBRE ENTRAINEMENT','APR','1','1','1','PE','undefined','undefined','null','undefined','undefined','undefined','Turning','undefined','undefined','undefined','F06Z004644','2019-09-06',NULL,'Submitted',NULL,0,0,12,89),(4,'COIFFE D\'ASSEMBLAGE','TARDY','1','1','1','TBD','undefined','undefined','undefined','undefined','undefined','undefined','Turning','undefined','undefined','undefined','F06Z014644','2019-09-06',NULL,'Submitted',NULL,0,0,12,85),(5,'GUIDE DE TIGE','APR','1','1','1','PA6','undefined','undefined','undefined','undefined','undefined','undefined','Turning','undefined','undefined','undefined','F06P12Z804','2019-09-06',NULL,'Submitted',NULL,0,0,8,70),(6,'DOIGT DE MAINTIEN','TARDY','1','1','1','ALU','undefined','undefined','undefined','undefined','undefined','undefined','Turning','undefined','undefined','undefined','F06P15Z845','2019-09-06',NULL,'Submitted',NULL,0,0,8,68),(7,'BAGUE DE CENTRAGE','APR','1','1','1','PA6','undefined','undefined','undefined','undefined','undefined','undefined','Multi','undefined','undefined','undefined','F06P22Z824','2019-09-06',NULL,'Submitted',NULL,0,0,9,52),(8,'BAGUE DE CENTRAGE','TARDY','1','1','1','ALU','NaN','NaN','NaN','NaN','NaN','NaN','Turning','NaN','NaN','undefined','F06P12Z602','2019-09-06','2019-09-06','Submitted',NULL,0,0,9,70),(9,'ARBRE ENTREE DE MOUVEMENT MID','APR','1','1','1','PE','undefined','undefined','500','40','40','800000','Turning','undefined','undefined','undefined','F06P40Z139','2019-09-06',NULL,'Submitted',NULL,0,0,10,67),(10,'COIFFE D\'ASSEMBLAGE','TARDY','1','1','1','undefined','NaN','NaN','500','50','50','1250000','Turning','NaN','NaN','undefined','F06P80Z156','2019-09-06','2019-09-06','Submitted',NULL,0,0,10,55),(11,'PION D\'INDEXAGE','APR','1','1','1','PE','undefined','undefined','50','40','40','80000','Turning','undefined','undefined','undefined','F06P90Z802','2019-09-06',NULL,'Submitted',NULL,0,0,11,66),(12,'BAGUE DE CALAGE','APR','1','1','1','PA66','undefined','undefined','50','50','25','62500','Turning','undefined','undefined','undefined','F06P11Z821','2019-09-06',NULL,'Submitted',NULL,0,0,7,52),(13,'BAGUE DE CALAGE','TARDY','1','1','1','ALU','undefined','undefined','50','50','25','62500','Turning','undefined','undefined','undefined','F06P12Z622','2019-09-06',NULL,'Submitted',NULL,0,0,7,68),(14,'PION','APR','1','1','1','PE','undefined','undefined','12','12','20','2880','Turning','undefined','undefined','undefined','F06Z004645','2019-09-06',NULL,'Submitted',NULL,0,0,13,54),(15,'GUIDE TUBE CONTACT MOBILE','APR','1','1','1','PA','undefined','undefined','37','37','250','342250','Turning','undefined','undefined','undefined','F06P11Z806','2019-09-06',NULL,'Submitted',NULL,0,0,6,59),(16,'DOIGT DE MAINTIEN','TARDY','1','1','1','TBD','undefined','undefined','35','35','250','306250','Turning','undefined','undefined','undefined','F06P15Z623','2019-09-06',NULL,'Submitted',NULL,0,0,6,62),(17,'GUIDE TUBE CONTACT MOBILE','APR','1','1','1','PA','undefined','undefined','57','57','300','974700','Turning','undefined','undefined','undefined','F06P11Z159','2019-09-06',NULL,'Submitted',NULL,0,0,5,89),(18,'DOIGT DE MAINTIEN','TARDY','1','1','1','TBD','None','None','55','55','300','907500','Turning','undefined','undefined','undefined','F06P11Z159','2019-09-06',NULL,'Submitted',NULL,0,0,5,66),(19,'HOSE','APR','1','2','0.5','PU','undefined','undefined','250','137','90','3082500','Injection','undefined','undefined','undefined','5801880930','2019-09-06',NULL,'Submitted',NULL,0,0,14,85),(20,'SERRE CABLE','APR','1','1','1','PA','undefined','undefined','26','26','32','21632','Milling','undefined','undefined','undefined','5801678219','2019-09-06',NULL,'Submitted',NULL,0,0,15,73),(21,'CADRE PUB 1100X350','APR','1','1','1','PC','NaN','NaN','1100','350','14','5390000','Milling','NaN','NaN','undefined','5801857804','2019-09-06','2019-09-06','Submitted',NULL,0,0,16,87),(22,'PANNEAU PUBLICITE','APR','1','1','1','PC','undefined','undefined','250','250','21','1312500','Milling','undefined','undefined','undefined','504101266','2019-09-06',NULL,'Submitted',NULL,0,0,17,69),(23,'PORTE ETIQUETTE','APR','1','1','1','undefined','undefined','undefined','110','40','10','44000','Milling','undefined','undefined','undefined','504158123','2019-09-06',NULL,'Submitted',NULL,0,0,18,68),(24,'VALVE CONTROLE MINIMUM','APR','1','1','1','PE','undefined','undefined','350','210','40','2940000','Milling','undefined','undefined','undefined','504239518','2019-09-06',NULL,'Submitted',NULL,0,0,19,74),(25,'BRIDE DE MAINTIEN','APR','1','1','1','PA6','undefined','undefined','18.5','18.5','32','10952','Turning','undefined','undefined','undefined','5801622548','2019-09-06',NULL,'Submitted',NULL,0,0,20,84),(26,'BUTTON DOOR','APR','1','1','1','PVC','undefined','undefined','32','32','20','20480','Milling','undefined','undefined','undefined','5801648038','2019-09-06',NULL,'Submitted',NULL,0,0,21,86),(27,'BRIDE DE SERRAGE','APR','1','1','1','PA','undefined','undefined','21','91','31','59241','undefined','undefined','undefined','undefined','5801661101','2019-09-06',NULL,'Submitted',NULL,0,0,22,71),(28,'GRILL FONDELLO','APR','1','1','1','PVC','undefined','undefined','320','640','10','2048000','Milling','undefined','undefined','undefined','5801677533','2019-09-06',NULL,'Submitted',NULL,0,0,23,80),(29,'TRAPS ATTACHEMENT CUP','APR','1','1','1','PE','undefined','undefined','31','58','79','142042','Multi','undefined','undefined','undefined','5801787715','2019-09-06',NULL,'Submitted',NULL,0,0,24,68),(30,'BARRE DE FERMETURE','APR','1','1','1','PVC','undefined','undefined','1250','40','40','2000000','Milling','undefined','undefined','undefined','5801362377','2019-09-06',NULL,'Submitted',NULL,0,0,25,58),(31,'OBTURATEUR PROFIL FINITION DROIT','APR','1','2','0.5','PETP','undefined','undefined','450','890','94','37647000','Milling','undefined','undefined','undefined','5801842451','2019-09-06',NULL,'Submitted',NULL,0,0,26,70),(32,'OBTURATEUR PROFIL FINITION GAUCHE','APR','1','2','0.5','PETP','undefined','undefined','450','890','40','16020000','Turning','undefined','undefined','undefined','5801842452','2019-09-06',NULL,'Submitted',NULL,0,0,27,88),(33,'CALE ENTRETOISE','APR','1','1','1','PE','undefined','undefined','51','94','62','297228','Turning','undefined','undefined','undefined','622019314','2019-09-06',NULL,'Submitted',NULL,0,0,28,59),(34,'DEMI-COLLIER','APR','1','2','0','PA','NaN','NaN','19','61','47','54473','Turning','NaN','NaN','undefined','622018919','2019-09-06','2019-09-06','Submitted',NULL,0,0,29,85),(35,'DEMI-COLLIER','APR','1','2','0.5','PA','undefined','undefined','41','91','24','89544','Turning','undefined','undefined','undefined','622018918','2019-09-06',NULL,'Submitted',NULL,0,0,30,74),(36,'SECTEUR DE GUIDAGE','APR','1','1','1','PE','undefined','undefined','150','150','30','675000','Turning','undefined','undefined','undefined','622018912','2019-09-06',NULL,'Submitted',NULL,0,0,31,76);
/*!40000 ALTER TABLE `features` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_quantity`
--

DROP TABLE IF EXISTS `product_quantity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `product_quantity` (
  `quantity_id` int(6) NOT NULL AUTO_INCREMENT,
  `quantity` int(11) DEFAULT NULL,
  `lot_size` int(11) DEFAULT NULL,
  `number_of_lot` int(11) DEFAULT NULL,
  `default_label` varchar(200) DEFAULT NULL,
  `project` int(6) DEFAULT NULL,
  `user` int(6) DEFAULT NULL,
  PRIMARY KEY (`quantity_id`),
  KEY `project` (`project`),
  KEY `user` (`user`),
  CONSTRAINT `product_quantity_ibfk_1` FOREIGN KEY (`project`) REFERENCES `project` (`project_id`),
  CONSTRAINT `product_quantity_ibfk_2` FOREIGN KEY (`user`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_quantity`
--

LOCK TABLES `product_quantity` WRITE;
/*!40000 ALTER TABLE `product_quantity` DISABLE KEYS */;
INSERT INTO `product_quantity` VALUES (4,1,1,1,'Prototype',1,1),(12,250,10,25,'Annuel',4,1),(14,200,1,200,'One shot',12,1),(15,300,12,25,'Annuel',8,1),(16,160,10,16,'Annuel',9,1),(17,250,10,25,'Annuel',10,1),(18,1000,5,200,'Annuel',11,1),(19,240,10,24,'Annuel',7,1),(20,1000,7,150,'Annuel',13,1),(21,500,10,50,'Annuel',6,1),(22,53,1,53,'One shot',14,1),(23,250,10,25,'',15,1),(24,14,14,1,'',16,1),(26,300,12,25,'',17,1),(27,50,50,1,'',18,1),(28,120,4,30,'',19,1),(29,100,5,20,'',20,1),(30,455,18,25,'',21,1),(31,1000,10,100,'',22,1),(33,395,13,30,'',23,1),(34,3240,5,600,'',24,1),(35,600,10,60,'',25,1),(36,500,10,50,'',26,1),(37,500,10,50,'',27,1),(38,46,1,46,'',28,1),(39,110,10,11,'',29,1),(40,28,1,28,'',30,1),(42,36,36,1,'',31,1);
/*!40000 ALTER TABLE `product_quantity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project`
--

DROP TABLE IF EXISTS `project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `project` (
  `project_id` int(6) NOT NULL AUTO_INCREMENT,
  `project_name` varchar(30) NOT NULL,
  `project_description` varchar(200) DEFAULT NULL,
  `customer` int(6) DEFAULT NULL,
  `decision` int(6) DEFAULT NULL,
  `status` varchar(30) DEFAULT NULL,
  `internal_reference` varchar(10) DEFAULT NULL,
  `expected_delivery` date DEFAULT NULL,
  `dcme_folder` varchar(50) DEFAULT NULL,
  `creation_date` date DEFAULT NULL,
  PRIMARY KEY (`project_id`),
  KEY `customer` (`customer`),
  KEY `decision` (`decision`),
  CONSTRAINT `project_ibfk_1` FOREIGN KEY (`customer`) REFERENCES `customer` (`customer_id`),
  CONSTRAINT `project_ibfk_2` FOREIGN KEY (`decision`) REFERENCES `decision` (`decision_id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project`
--

LOCK TABLES `project` WRITE;
/*!40000 ALTER TABLE `project` DISABLE KEYS */;
INSERT INTO `project` VALUES (1,'DT1523','Test proto',1,1,'Submited','APRDT-0','2020-02-13',NULL,'2019-06-18'),(2,'Test1','Test1',1,2,'Submited','APRTE-1','2020-02-13',NULL,'2019-07-02'),(3,'CHANTIER MARSEILLE','Crutch ensemble   crutch clip',1,3,'Submited','APRCH-2','2019-07-31',NULL,'2019-07-17'),(4,'F01P19','ARBRE ENTREE DE MVT SECTIONNEUR',7,4,'Submited','APRF0-3','2019-04-03',NULL,'2019-03-15'),(5,'F01P24','GUIDE TUBE CONTACT MOBILE',7,5,'Submited','APRF0-3','2019-05-12',NULL,'2019-04-27'),(6,'F01P31','GUIDE TUBE CONTACT MOBILE',7,6,'Submited','GE-4','2019-06-09',NULL,'2019-05-02'),(7,'F01P32','BAGUE DE CALAGE',7,7,'Submited','GE-5','2019-06-20',NULL,'2019-05-17'),(8,'F01P33','GUIDE DE TIGE',7,8,'Submited','GE-6','2019-07-17',NULL,'2019-07-01'),(9,'F01P38','BAGUE DE CENTRAGE',7,9,'Submited','GE-7','2019-07-17',NULL,'2019-07-01'),(10,'F01P39','ARBRE ENTREE DE MOUVEMENT MID',7,10,'Submited','GE-8','2019-07-17',NULL,'2019-07-01'),(11,'F01P40','PION D\'INDEXAGE',7,11,'Submited','GE-9','2019-07-17',NULL,'2019-07-01'),(12,'F01P41','ARBRE ENTRAINEMENT',7,12,'Submited','GE-10','2019-07-25',NULL,'2019-06-12'),(13,'F01P46','PION',7,13,'Submited','GE-11','2019-06-20',NULL,'2019-05-17'),(14,'HOSE','HOSE',8,14,'Submited','IVE-1','2019-04-14',NULL,'2019-03-06'),(15,'SERRE CABLE',NULL,8,15,'Submited','IVE-2','2019-04-14',NULL,'2019-03-06'),(16,'CADRE PUB 1100X350',NULL,8,16,'Submited','IVE-3','2019-04-14',NULL,'2019-03-06'),(17,'PANNEAU PUBLICITE',NULL,8,17,'Submited','IVE-4','2019-04-14',NULL,'2019-03-06'),(18,'PORTE ETIQUETTE',NULL,8,18,'Submited','IVE-5','2019-06-18',NULL,'2019-05-20'),(19,'VALVE CONTROLE MINIMUM',NULL,8,19,'Submited','IVE-6','2019-06-26',NULL,'2019-05-10'),(20,'BRIDE DE MAINTIEN',NULL,8,20,'Submited','IVE-7','2019-06-26',NULL,'2019-05-10'),(21,'BUTTON DOOR',NULL,8,21,'Submited','IVE-8','2019-07-07',NULL,'2019-04-18'),(22,'BRIDE DE SERRAGE',NULL,8,22,'Submited','IVE-9','2019-07-07',NULL,'2019-04-18'),(23,'GRILL FONDELLO',NULL,8,23,'Submited','IVE-10','2019-07-07',NULL,'2019-04-18'),(24,'TRAPS ATTACHEMENT CUP',NULL,8,24,'Submited','IVE-11','2019-07-15',NULL,'2019-06-15'),(25,'BARRE DE FERMETURE',NULL,8,25,'Submited','IVE-12','2019-08-03',NULL,'2019-06-15'),(26,'OBTURATEUR PRFL FINI DRT',NULL,8,26,'Submited','IVE-13','2019-09-12',NULL,'2019-07-13'),(27,'OBTURATEUR PRFL FINI GCHE',NULL,8,27,'Submited','IVE-14','2019-09-12',NULL,'2019-07-13'),(28,'622019314','Montage spécifique robotique',9,28,'Submited','IVE-15','2019-07-25',NULL,'2019-05-11'),(29,'622018919','Montage spécifique robotique',9,29,'Submited','IVE-16','2019-07-25',NULL,'2019-05-11'),(30,'622018918','Montage spécifique robotique',9,30,'Submited','IVE-17','2019-07-25',NULL,'2019-05-11'),(31,'622018912','Montage spécifique robotique',9,31,'Submited','IVE-18','2019-07-25',NULL,'2019-05-11');
/*!40000 ALTER TABLE `project` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `sessions` (
  `session_id` varchar(128) NOT NULL,
  `expires` int(11) DEFAULT NULL,
  `data` text,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('eb742135-cea2-4a99-a520-d7ec4cfe3763',1567779090,'{\"cookie\":{\"originalMaxAge\":3599993,\"expires\":\"2019-09-06T14:11:29.573Z\",\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":1}}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `users` (
  `user_id` int(6) NOT NULL AUTO_INCREMENT,
  `login` varchar(30) DEFAULT NULL,
  `password` varchar(30) DEFAULT NULL,
  `customer` int(6) DEFAULT NULL,
  `role` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  KEY `customer` (`customer`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`customer`) REFERENCES `customer` (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'informatique@apr.eu','mozilla69',1,'APR'),(3,'benjamin@apr.eu','toto',3,'guest'),(4,'alouvel@apr.eu','toto',4,'guest'),(5,'admin@admin.fr','admin',5,'guest'),(6,'ygerphagnon@tardy.fr','tardy',6,'guest');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-09-06 15:12:55
