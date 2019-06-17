VERSION 5.00
Begin {C62A69F0-16DC-11CE-9E98-00AA00574A4F} uf_newProject 
   Caption         =   "Espace Collaboratif"
   ClientHeight    =   15165
   ClientLeft      =   45
   ClientTop       =   390
   ClientWidth     =   28710
   OleObjectBlob   =   "uf_newProject.frx":0000
   StartUpPosition =   1  'CenterOwner
End
Attribute VB_Name = "uf_newProject"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Private Sub img_pictoAdd_Click()

Dim strFileToOpen As String

strFileToOpen = Application.GetOpenFilename _
(Title:="Please choose a file to open")


If strFileToOpen = False Then
    MsgBox "No file selected.", vbExclamation, "Sorry!"
    Exit Sub
Else
    Workbooks.Open Filename:=strFileToOpen
End If


End Sub

Private Sub img_pictoHisto_Click()

uf_newProject.Hide

End Sub

Private Sub img_pictohome_Click()

uf_newProject.Hide

End Sub

Private Sub img_pictologout_Click()



End Sub

Private Sub Label1_Click()

uf_newProject.Hide

End Sub

Private Sub lb_projectDoc_Click()

End Sub
