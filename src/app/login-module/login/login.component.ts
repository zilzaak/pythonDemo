import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginServiceService } from '../service/login-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  loginForm!: FormGroup;
  showForgotPasswordModal = false;
   baseUrl=environment.baseUrl;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginServiceService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  get formFields() {
    return this.loginForm.controls;
  }




  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const loginData = {
      username: this.formFields.username.value,
      password: this.formFields.password.value
    };

     this.loginService.generateToken(loginData).subscribe(
      (response: any) => {
         this.loginService.saveToken(response.token);  
         this.router.navigate(['/dashboard']);  
      },
      (error) => {
        alert('Invalid username or password');
      });     
  
  }



  openForgotPasswordModal() {
    this.showForgotPasswordModal = true;
  }

  closeForgotPasswordModal() {
    this.showForgotPasswordModal = false;
  }

  resetPassword(email: string) {
    console.log('Reset password requested for:', email);
    alert('Password reset request sent to your email.');
    this.closeForgotPasswordModal();
  }

  // Helper Methods for Validation Messages
  isUsernameRequiredError(): boolean {
    const usernameControl = this.formFields.username;
    return usernameControl.touched && usernameControl.hasError('required');
  }

  isPasswordRequiredError(): boolean {
    const passwordControl = this.formFields.password;
    return passwordControl.touched && passwordControl.hasError('required');
  }

  isPasswordMinLengthError(): boolean {
    const passwordControl = this.formFields.password;
    return passwordControl.touched && passwordControl.hasError('minlength');
  }





}