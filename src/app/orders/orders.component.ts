import { Component, OnInit } from '@angular/core';
import { OrderService } from '../shared/order.service';
import { Order } from '../shared/order.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  ordersList: Order[];
  constructor(private orderService: OrderService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    this.getOrdersList();
  }
  getOrdersList() {
    this.orderService.getOrderList().subscribe(orders => this.ordersList = orders);
  }
  openForEdit(orderID: number) {
    this.router.navigate(['/order/edit/' + orderID]);
  }
  onOrderDelete(orderID: number) {
    if(confirm('Are you sure you want to delete this order?')){
      this.orderService.deleteOrder(orderID).subscribe(res => {
        this.getOrdersList();
        this.toastr.success('Deleted Successfully', 'Restaurant App');
      });
    }
  }
}
