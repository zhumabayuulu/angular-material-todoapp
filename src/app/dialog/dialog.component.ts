import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import {MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {
  conditionTask: string[] = ["work","Family","friends"]
  taskForm!:FormGroup
  actionBtn: string ="save"

  constructor(
    private formBuilder:FormBuilder,
    private api: ApiService,
    private dialogRef:MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any
  )
    {}

  ngOnInit(): void {
    this.taskForm = this.formBuilder.group({
      taskName:["",Validators.required],
      Description: ['',Validators.required],
      condition:['',Validators.required],
      date:["",Validators.required]

    })
    if(this.editData){
      this.actionBtn = "Update"
      this.taskForm.controls['taskName'].setValue(this.editData.taskName);
      this.taskForm.controls['Description'].setValue(this.editData.Description);
      this.taskForm.controls['condition'].setValue(this.editData.condition);
      this.taskForm.controls['date'].setValue(this.editData.date);
    }
      
    
    
  }
  addTask(){
    if(!this.editData){
      if(this.taskForm.valid){
        this.api.postTask(this.taskForm.value)
        .subscribe({
          next:() => {
            
            this.taskForm.reset()
            this.dialogRef.close("save")
          },
          error:() => {
            alert("Something went wrong while adding")
          }
        })
      }
    }else {
      this.updateTask()
    }
  }

  updateTask(){
    this.api.putTask(this.taskForm.value,this.editData.id)
    .subscribe({
      next:(res) => {
       
        this.taskForm.reset()
        this.dialogRef.close('Update')
      },
      error:()=> {
        alert(" Something went wrong while update")
      }
    })
  }

}
