import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderFilter'
})
export class OrderFilterPipe implements PipeTransform {

  transform(litems: any[], value: string, prop: string): any[] {
    console.log("litems ", litems);
    let items = JSON.parse(JSON.stringify(litems));
    if (!items) return [];
    if (!value) return items;

    let filterOrders = items.filter(order => {
      if(order[prop].toLowerCase().includes(value.toLowerCase())) {
        return order[prop].toLowerCase().includes(value.toLowerCase())
      } else {
        let lineItems = order.line_items.filter(product => {
          return product.name.toLowerCase().includes(value.toLowerCase())
        })
        if(lineItems?.length > 0) {
          order.line_items = [];
          order.line_items = lineItems;
          console.log("lorder ", order);
          return order;
        }
      }
    });
    
    // console.log("filterOrders ", filterOrders);
    return filterOrders;
  }

}
