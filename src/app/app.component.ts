import { Component, ViewChild,OnInit } from '@angular/core';
import { DialogComponent } from './dialog/dialog.component';
import {MatDialog,} from '@angular/material/dialog';
import { ApiService } from './services/api.service';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource,} from '@angular/material/table';
import {MatPaginator,} from '@angular/material/paginator';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  constructor(public dialog: MatDialog,private api: ApiService) {}

  displayedColumns: string[] = ['taskName', 'Description', 'condition', 'date','action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.getAlltask()
  }
  title = 'angularmaterial-todo-app';
  openDialog() {
    this.dialog.open(DialogComponent, {
      width:"30%"
    }).afterClosed().subscribe(res =>{
      if(res === "save"){
        this.getAlltask()
      }
    })
  }
  getAlltask(){
    this.api.getTask()
    .subscribe({
      next:(res)=> {
        this.dataSource = new MatTableDataSource(res)
        this.dataSource.paginator = this.paginator
        this.dataSource.sort = this.sort
      },
      error:()=>{
        alert("Somethin went wrong while get task")
      }
      
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  editTask(row: any) {
    this.dialog.open(DialogComponent, {
      width:'30%',
      data: row
    }).afterClosed().subscribe(res =>{
      if(res === "save"){
        this.getAlltask()
      }
    })
  }
  deleteTask(id: number) {
    this.api.deleteTask(id)
    .subscribe({
      next:(res) =>{
        this.getAlltask()
        
      },error:() => {
        alert('something wen wrong while delete task')
      }
        })
  }
  
}


