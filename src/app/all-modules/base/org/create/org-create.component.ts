import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonServiceService } from 'src/app/all-modules/commonService/common-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-org-create',
  templateUrl: './org-create.component.html',
  styleUrls: ['./org-create.component.css']
})
export class OrgCreateComponent implements OnInit {

  constructor(private commmonService: CommonServiceService,
    private formBuilder: FormBuilder,
    private activeRouter: ActivatedRoute,
    private router:Router
  ) { }
  createForm!: FormGroup;
  pageTitle!: any;
  baseUrl = environment.baseUrl;
  loading = false;


  ngOnInit(): void {
    this.initializeForm();
    this.pageTitle = this.activeRouter.snapshot.data['title'];
    if(this.pageTitle==='View' || this.pageTitle==='Edit'){
    this.getFormData(this.activeRouter.snapshot.params.id);
    }
  }


  getFormData(id:any){
    let api=this.baseUrl+"/base/organization/list"
    this.commmonService.getWithToken(api,{orgId:id}).subscribe(
      { next: (response) => {
        this.createForm.patchValue(response?.data?.listData[0]);
        },
        error: (err) => {
        }
      }
    )
  }


  initializeForm() {
    this.createForm = this.formBuilder.group({
      id:[''],
      name:['',Validators.required],
      phone: [''],
      address: ['', Validators.required],
      remarks: ['', Validators.required],
    });
  }



  onSubmit() {
    this.loading=true;
    const api = this.baseUrl + "/base/organization/create";
  let org:any={
    id:this.createForm.value.id,    
    name:this.createForm.value.name,   
     phone:this.createForm.value.phone,
     address:this.createForm.value.address,
  } 

console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
console.log(org);




    this.commmonService.sendPostPutReq<any>(api, org,"post").subscribe({
      next: (response: any) => {
        if (response.success) {
          this.router.navigate(['/base/organization/list']);
        } else {
          alert(response.message);
          this.router.navigate(['/base/organization/list']);
        }
      }
    });
  }


}
