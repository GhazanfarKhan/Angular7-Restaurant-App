import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { OrderService } from 'src/app/shared/order.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { OrderItemsComponent } from '../order-items/order-items.component';
import { CustomerService } from 'src/app/shared/customer.service';
import { Customer } from 'src/app/shared/customer.model';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  customerList: Customer[]
  isValid: boolean = true;
  constructor(
    private service: OrderService,
    private dialogue: MatDialog,
    private customerService: CustomerService,
    private toastr: ToastrService,
    private router: Router,
    private currentRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    let orderID = this.currentRoute.snapshot.paramMap.get('id');
    if (orderID == null) {
      this.resetForm();
    }
    else {
      this.getOrderById(parseInt(orderID));
    }

    this.getCustomerList();
  }
  resetForm(form?: NgForm) {
    if (form)
      form.resetForm();
    this.service.formData = {
      OrderID: null,
      OrderNo: Math.floor(10000 + Math.random() * 90000).toString(),
      CustomerID: 0,
      PMethod: '',
      GTotal: 0,
      DeletedOrderItemIDs: ''
    };
    this.service.orderItems = [];
  }
  AddOrEditOrderItem(OrderItemIndex, OrderID) {
    const dialogueConfig = new MatDialogConfig();
    dialogueConfig.autoFocus = true;
    dialogueConfig.disableClose = true;
    dialogueConfig.width = "50%";
    dialogueConfig.data = { OrderItemIndex, OrderID };
    this.dialogue.open(OrderItemsComponent, dialogueConfig).afterClosed().subscribe(res => {
      this.updateGrandTotal();
    })
  }
  getCustomerList() {
    this.customerService.getCustomerList()
      .subscribe(customers => this.customerList = customers);
  }
  onDeleteOrderItem(orderItemID: number, index: number) {
    if (orderItemID != null) {
      this.service.formData.DeletedOrderItemIDs += orderItemID + ",";
    }
    this.service.orderItems.splice(index, 1);
    this.updateGrandTotal();
  }
  updateGrandTotal() {
    this.service.formData.GTotal = this.service.orderItems.reduce((prev, curr) => {
      return prev + curr.Total;
    }, 0);
    this.service.formData.GTotal = parseFloat(this.service.formData.GTotal.toFixed(2));
  }
  validateForm() {
    this.isValid = true;
    if (this.service.formData.CustomerID == 0 || this.service.orderItems.length == 0 && this.service.formData.PMethod == '') {
      this.isValid = false;
    }
    return this.isValid;
  }
  getOrderById(id) {
    this.service.getOrderById(id).subscribe(o => {
      this.service.formData = o.order;
      this.service.orderItems = o.orderDetails;
    });
  }
  onSubmit(form: NgForm) {
    if (!this.validateForm()) {
      return;
    }
    this.service.saveOrUpdateOrder().subscribe(res => {
      this.resetForm();
      this.toastr.success('Submitted Succssfully', 'Restaurant App');
      this.router.navigate(['/orders']);
    });
  }
}
