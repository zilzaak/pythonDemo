import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonServiceService } from 'src/app/all-modules/commonService/common-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit {
  constructor(private commmonService: CommonServiceService,
    private formBuilder: FormBuilder,
    private activeRouter: ActivatedRoute,
    private router:Router
  ) { }
  createForm!: FormGroup;
  pageTitle!: any;
  baseUrl = environment.baseUrl;
  roleList: any[]=[];
  selectedRole:any[]=[];
  loading = false;
  ngOnInit(): void {
    this.initializeForm();
    this.fetchRoles();
    this.pageTitle = this.activeRouter.snapshot.data['title'];
    if(this.pageTitle==='View' || this.pageTitle==='Edit'){
    this.getFormData(this.activeRouter.snapshot.params.id);
    }
  }

  isExist(id:any){

    for(let x of this.selectedRole){
         if(x.id===id){
           return true;
         }
    }

    return false;
  }

  getFormData(id:any){
    let api=this.baseUrl+"/base/user/get"
    this.commmonService.getWithToken(api,{id:id}).subscribe(
      { next: (response) => {
        this.createForm.patchValue(response);
        this.selectedRole=response.roles;
        },
        error: (err) => {
        }
      }
    )

  }


  initializeForm() {
    this.createForm = this.formBuilder.group({
      enabled: [true],
      email: [''],
      username:[''],
      password:[''],
      phone: [''],
      address: ['', Validators.required],
      displayName: ['', Validators.required],
    });
  }

  fetchRoles() {
    let api=this.baseUrl+"/base/role/list"
    this.commmonService.getWithToken(api,{}).subscribe(
      { next: (response) => {
        this.roleList = response?.data?.listData;
        console.log("==========================")
        console.log(this.roleList)
        },
        error: (err) => {
        }
      }
    )
  }

  setRoles(index:any){
    console.log("======================");
    console.log(this.selectedRole);
    let role:any;
    role=this.roleList[index];
    let i:any;  i=0;
    for(let obj of this.selectedRole){
       if(role.id===obj.id){
        this.selectedRole.splice(i,1);
        return;
       }      
      i++;
      }
    this.selectedRole.push(role);
  }


  onSubmit() {
    this.loading=true;
    const api = this.baseUrl + "/base/user/create";
    const user = { ...this.createForm.value };
    user.roles = this.selectedRole.map(x => x.authority);  
    this.commmonService.sendPostPutReq<any>(api, user,"post").subscribe({
      next: (response: any) => {
        if (response.success) {
          this.router.navigate(['/base/user/list']);
        } else {
          alert(response.message);
          this.router.navigate(['/base/user/list']);
        }
      }
    });
  }

}


