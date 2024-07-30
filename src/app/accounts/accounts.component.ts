import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AccoutsService} from "../services/accouts.service";
import {catchError, Observable, throwError} from "rxjs";
import {AccountDetails} from "../model/account.model";

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css'
})
export class AccountsComponent implements OnInit{
  accountFormGroup! : FormGroup;
  currentPage : number = 0;
  pageSize : number = 5;
  accountObservable! : Observable<AccountDetails>;
  operationsFormGroup! : FormGroup;
  errorMessage! : string;
  constructor(private fb : FormBuilder , private accoutsService : AccoutsService) {
  }
  ngOnInit(): void {
    this.accountFormGroup=this.fb.group({
      accountId : this.fb.control('')
    });

    this.operationsFormGroup=this.fb.group({
      operationType : this.fb.control(null),
      amount : this.fb.control(0),
      description : this.fb.control(null),
      accountDestination : this.fb.control(null)

      }

    )
  }

  handleSearchAccount() {
    let accountId : string = this.accountFormGroup.value.accountId;
    this.accountObservable = this.accoutsService.getAccounts(accountId, this.currentPage, this.pageSize).pipe(
      catchError(err=>{
        this.errorMessage=err.error.message;
      return throwError(err);
      })
    );

  }

  goPage(page: number) {
    this.currentPage=page;
    this.handleSearchAccount();

  }

  handleOperationAccount() {

    let accountId : string = this.accountFormGroup.value.accountId;
    let operationType = this.operationsFormGroup.value.operationType;
    let amount : number = this.operationsFormGroup.value.amount;
    let description : string = this.operationsFormGroup.value.description;
    let accountDestination :string =this.operationsFormGroup.value.accountDestination;

    if (operationType =='DEBIT'){
      this.accoutsService.debit(accountId,amount,description).subscribe({
        next : (data)=>{
          alert("Success Debit");
          this.operationsFormGroup.reset();
          this.handleSearchAccount();
        },
        error:(err)=>{
          console.log(err);
        }
      });

    }else if (operationType=='CREDIT'){
      this.accoutsService.credit(accountId,amount,description).subscribe({
        next : (data)=>{
          alert("Success Credit");
          this.operationsFormGroup.reset();
          this.handleSearchAccount();
        },
        error:(err)=>{
          console.log(err);
        }
      });

    }
    else if (operationType=='TRANSFER'){
      this.accoutsService.transfer(accountId,accountDestination,amount,description).subscribe({
        next : (data)=>{
          alert("Success Transfert");
          this.operationsFormGroup.reset();
          this.handleSearchAccount();
        },
        error:(err)=>{
          console.log(err);
        }
      });

    }
  }

}
