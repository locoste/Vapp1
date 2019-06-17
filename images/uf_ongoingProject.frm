VERSION 5.00
Begin {C62A69F0-16DC-11CE-9E98-00AA00574A4F} uf_ongoingProject_customer 
   Caption         =   "Collaborative Workspace"
   ClientHeight    =   15165
   ClientLeft      =   45
   ClientTop       =   390
   ClientWidth     =   28710
   OleObjectBlob   =   "uf_ongoingProject.frx":0000
   StartUpPosition =   1  'CenterOwner
End
Attribute VB_Name = "uf_ongoingProject_customer"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Private Sub img_pictoHisto_Click()
uf_ongoingProject_customer.Hide
End Sub

Private Sub Label1_Click()
uf_ongoingProject_customer.Hide
End Sub


Private Sub UserForm_Initialize()

With uf_ongoingProject_customer.lb_ongoingProjects
    .ColumnHeads = True
    .RowSource = "Projets!A2:H40"
End With
End Sub
