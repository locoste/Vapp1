VERSION 5.00
Begin {C62A69F0-16DC-11CE-9E98-00AA00574A4F} uf_featureInfo 
   Caption         =   "Feature Information"
   ClientHeight    =   15165
   ClientLeft      =   45
   ClientTop       =   390
   ClientWidth     =   28710
   OleObjectBlob   =   "uf_featureInfo.frx":0000
   StartUpPosition =   1  'CenterOwner
End
Attribute VB_Name = "uf_featureInfo"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Private Sub CommandButton6_Click()

End Sub

Private Sub cb_attrib_Change()

End Sub

Private Sub CommandButton1_Click()
uf_featureInfo.Hide
End Sub

Private Sub CommandButton2_Click()

If CommandButton2.BackColor = &H8000000D Then
CommandButton2.BackColor = &H8000000F
CommandButton2.ForeColor = &H8000000A
CommandButton2.Tag = 0
Else
CommandButton2.BackColor = &H8000000D
CommandButton2.ForeColor = &H80000008
CommandButton2.Tag = 1
End If

End Sub

Private Sub CommandButton3_Click()

If CommandButton3.BackColor = &H8000000D Then
CommandButton3.BackColor = &H8000000F
CommandButton3.ForeColor = &H8000000A
CommandButton3.Tag = 0

Else
CommandButton3.BackColor = &H8000000D
CommandButton3.ForeColor = &H80000008
CommandButton3.Tag = 1

End If

End Sub

Private Sub CommandButton4_Click()
If CommandButton4.BackColor = &H8000000D Then
CommandButton4.BackColor = &H8000000F
CommandButton4.ForeColor = &H8000000A
CommandButton4.Tag = 0

Else
CommandButton4.BackColor = &H8000000D
CommandButton4.ForeColor = &H80000008
CommandButton4.Tag = 1

End If
End Sub

Private Sub CommandButton5_Click()
If CommandButton5.BackColor = &H8000000D Then
CommandButton5.BackColor = &H8000000F
CommandButton5.ForeColor = &H8000000A
CommandButton5.Tag = 0

Else
CommandButton5.BackColor = &H8000000D
CommandButton5.ForeColor = &H80000008
CommandButton5.Tag = 1

End If
End Sub


Private Sub Frame1_Click()

End Sub

Private Sub Frame3_Click()

End Sub

Private Sub img_plan_Click()

End Sub

Private Sub img_step_Click()

End Sub


Private Sub lb_doc1_DblClick(ByVal Cancel As MSForms.ReturnBoolean)
img_plan.Visible = True
lb_doc1.Visible = False
Label19.Visible = False


End Sub


Private Sub lb_doc2_DblClick(ByVal Cancel As MSForms.ReturnBoolean)
img_step.Visible = True
lb_doc2.Visible = False
Label18.Visible = False

End Sub

Private Sub submitButton_Click()

Dim productSheet As String
Dim startCell As String

productSheet = "Produits"
startCell = "A2"

Select Case MsgBox("Is this feature ready for quotation ? If you click YES, analyse process may start immediatly.", vbYesNoCancel, "Feature save")
    Case vbYes
    Worksheets(productSheet).Select
    Range(startCell).Select

    Selection.End(xlDown).Select
    Selection.End(xlDown).Select
    Selection.End(xlUp).Select
    ActiveCell.Offset(1, 0).Select

    Selection.Value = tb_ref
    ActiveCell.Offset(0, 1).Value = tb_label.Value
    ActiveCell.Offset(0, 2).Value = tb_component.Value
    ActiveCell.Offset(0, 3).Value = tb_compound.Value
    ActiveCell.Offset(0, 4).Value = tb_ratio.Value
    ActiveCell.Offset(0, 5).Value = cb_attrib.Value
    ActiveCell.Offset(0, 6).Value = "Anotated"
    ActiveCell.Offset(0, 7).Value = Selection.Row
    ActiveCell.Offset(0, 8).Value = tb_material.Value
    ActiveCell.Offset(0, 9).Value = tb_width.Value
    ActiveCell.Offset(0, 10).Value = tb_lenght.Value
    ActiveCell.Offset(0, 11).Value = tb_height.Value
    ActiveCell.Offset(0, 12).Value = tb_volume.Value
    ActiveCell.Offset(0, 13).Value = CommandButton2.Tag
    ActiveCell.Offset(0, 14).Value = CommandButton3.Tag
    ActiveCell.Offset(0, 15).Value = CommandButton4.Tag
    ActiveCell.Offset(0, 16).Value = CommandButton5.Tag
    ActiveCell.Offset(0, 17).Value = cb_tolerance.Value
    ActiveCell.Offset(0, 18).Value = cb_rugosity.Value
    ActiveCell.Offset(0, 19).Value = tb_comments.Value
    ActiveCell.Offset(0, 20).Value = [Tampon!A1]
    uf_featureInfo.Hide
    
    Case vbNo
    MsgBox "Your feature as been saved. But it status remains <In treatment>."
    Worksheets(productSheet).Select
    Range(startCell).Select

    Selection.End(xlDown).Select
    Selection.End(xlDown).Select
    Selection.End(xlUp).Select
    ActiveCell.Offset(1, 0).Select

    Selection.Value = tb_ref
    ActiveCell.Offset(0, 1).Value = tb_label.Value
    ActiveCell.Offset(0, 2).Value = tb_component.Value
    ActiveCell.Offset(0, 3).Value = tb_compound.Value
    ActiveCell.Offset(0, 4).Value = tb_ratio.Value
    ActiveCell.Offset(0, 5).Value = cb_attrib.Value
    ActiveCell.Offset(0, 6).Value = "In treatment"
    ActiveCell.Offset(0, 7).Value = Selection.Row

    ActiveCell.Offset(0, 8).Value = tb_material.Value
    ActiveCell.Offset(0, 9).Value = tb_width.Value
    ActiveCell.Offset(0, 10).Value = tb_lenght.Value
    ActiveCell.Offset(0, 11).Value = tb_height.Value
    ActiveCell.Offset(0, 12).Value = tb_volume.Value
    ActiveCell.Offset(0, 13).Value = CommandButton2.Tag
    ActiveCell.Offset(0, 14).Value = CommandButton3.Tag
    ActiveCell.Offset(0, 15).Value = CommandButton4.Tag
    ActiveCell.Offset(0, 16).Value = CommandButton5.Tag
    ActiveCell.Offset(0, 17).Value = cb_tolerance.Value
    ActiveCell.Offset(0, 18).Value = cb_rugosity.Value
    ActiveCell.Offset(0, 19).Value = tb_comments.Value
    ActiveCell.Offset(0, 20).Value = [Tampon!A1]

    uf_featureInfo.Hide

    Case vbCancel
    Exit Sub
End Select
End Sub

Private Sub tb_compound_Change()

If IsNull(tb_compound.Value) Or IsEmpty(tb_compound.Value) Then
Exit Sub
Else
tb_ratio.Value = tb_compound.Value / tb_component.Value
End If
End Sub


Private Sub tb_height_Change()

tb_volume.Value = (tb_width.Value * tb_height.Value * tb_lenght.Value) / 100

End Sub

Private Sub UserForm_Initialize()

cb_attrib.AddItem ("APR")
cb_attrib.AddItem ("TARDY")

cb_tolerance.AddItem ("Millimeter")
cb_tolerance.AddItem ("Tenth of mm")
cb_tolerance.AddItem ("Hundreth of mm")
cb_tolerance.AddItem ("Micron")

cb_rugosity.AddItem ("50")
cb_rugosity.AddItem ("25")
cb_rugosity.AddItem ("12.5")
cb_rugosity.AddItem ("6.3")
cb_rugosity.AddItem ("3.2")
cb_rugosity.AddItem ("1.6")
cb_rugosity.AddItem ("0.8")
cb_rugosity.AddItem ("0.4")
cb_rugosity.AddItem ("0.2")
cb_rugosity.AddItem ("0.1")

lb_doc1.AddItem "dt6278260_v2.pdf"
lb_doc1.AddItem "dt6278261_v2.step"
lb_doc2.AddItem "dt6278260_v2.pdf"
lb_doc2.AddItem "dt6278261_v2.step"

lb_doc1.Visible = True
lb_doc2.Visible = True
Label18.Visible = True
Label19.Visible = True

img_step.Visible = False
img_plan.Visible = False
End Sub
