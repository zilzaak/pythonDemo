import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonServiceService } from 'src/app/all-modules/commonService/common-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-menu-create',
  templateUrl: './menu-create.component.html',
  styleUrls: ['./menu-create.component.css']
})
export class MenuCreateComponent implements OnInit {

  constructor(private commmonService: CommonServiceService,
    private formBuilder: FormBuilder,
    private activeRouter: ActivatedRoute,
    private router:Router
  ) { }
  createForm!: FormGroup;
  pageTitle!: any;
  opMode!:any;
  api!:any;
  baseUrl = environment.baseUrl;
  loading = false;
  showSaveBtn:boolean = true; 
  ngOnInit(): void {
    this.initializeForm();
    this.pageTitle = this.activeRouter.snapshot.data['title'];
    if(this.pageTitle==='Create'){
      this.opMode="create";
      this.api= this.baseUrl + "/base/role/create";
    }
    if(this.pageTitle==='Edit'){
      this.api= this.baseUrl + "/base/role/update";
      this.opMode="edit";
      this.formData(this.activeRouter.snapshot.params.id);
    }
    if(this.pageTitle==='View'){
      this.api= this.baseUrl + "/base/role/view";
      this.opMode="view";
      this.createForm.controls['authority'].disable();
      this.createForm.controls['remarks'].disable();
      this.showSaveBtn=false;
      
    }
  }


  formData(id: any) {
    let para:any={id:id};
    let api=this.baseUrl+"/base/role/get"
    this.commmonService.getWithToken(api,para).subscribe(
      { next: (response) => {
           this.createForm.patchValue(response);
        },
        error: (err) => {
        }
      }
    )

  }


  initializeForm() {
    this.createForm = this.formBuilder.group({
      id:[''],
      authority: [''],
      remarks: [''],
      created:[""],
      updated: [''],
    });
  }


  onSubmit() {
    if(this.opMode==='view'){
       return;
    }
    this.loading=true;
    const user = { ...this.createForm.value };
    let mthod:any;
    if(this.opMode==='create'){
      mthod="post";
    }
    if(this.opMode==='edit'){
      mthod="put";
    }
      this.commmonService.sendPostPutReq<any>(this.api, user,mthod).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.router.navigate(['/base/role/list']);
          } else {
            alert(response.message);
            this.router.navigate(['/base/role/list']);
          }
        }
      });
  }
}
