import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { OrderItem } from 'src/app/shared/order-item.model';
import { Item } from 'src/app/shared/item.model';
import { ItemService } from 'src/app/shared/item.service';
import { NgForm } from '@angular/forms';
import { OrderService } from 'src/app/shared/order.service';

@Component({
  selector: 'app-order-items',
  templateUrl: './order-items.component.html',
  styleUrls: ['./order-items.component.css']
})
export class OrderItemsComponent implements OnInit {
  formData: OrderItem;
  itemList: Item[];
  isValid: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogueRef: MatDialogRef<OrderItemsComponent>,
    private itemService: ItemService,
    private orderService: OrderService
  ) { }

  ngOnInit() {
    this.getItemsList();
    if (this.data.OrderItemIndex == null) {
      this.formData = {
        OrderItemID: null,
        OrderID: this.data.OrderID,
        ItemID: 0,
        ItemName: '',
        Price: 0,
        Quantity: 0,
        Total: 0
      }
    }
    else
      this.formData = Object.assign({}, this.orderService.orderItems[this.data.OrderItemIndex]);
  }

  getItemsList() {
    this.itemService.getItemList()
      .subscribe(items => this.itemList = items);
  }
  updatePrice(ctrl) {
    if (ctrl.selectedIndex == 0) {
      this.formData.Price = 0;
      this.formData.ItemName = '';
    }
    else {
      this.formData.Price = this.itemList[ctrl.selectedIndex - 1].Price;
      this.formData.ItemName = this.itemList[ctrl.selectedIndex - 1].Name;
    }
    this.updateTotal();
  }
  updateTotal() {
    this.formData.Total = parseFloat((this.formData.Quantity * this.formData.Price).toFixed(2));
  }
  validateForm(formData: OrderItem) {
    this.isValid = true;
    if (formData.ItemID == 0 || formData.Quantity == 0) {
      this.isValid = false;
    }
    return this.isValid;
  }
  onSubmit(form: NgForm) {
    if (!this.validateForm(form.value)) {
      return;
    }
    if (this.data.OrderItemIndex == null) {
      this.orderService.orderItems.push(form.value);
    }
    else{
      this.orderService.orderItems[this.data.OrderItemIndex] = form.value;
    }
    this.dialogueRef.close();
  }
}
