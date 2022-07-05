import { Router } from "@angular/router";

export class CommonMethods {

  constructor(public router: Router) {
  }

  clear() {
   // localStorage.setItem('info', null);
   // localStorage.setItem('change', null);
   // localStorage.setItem('currPrd', null);
    //localStorage.setItem('email',null);
    localStorage.setItem('recentPosts',null);
    localStorage.setItem('categorySection',null);
    localStorage.setItem('homePost',null);
    localStorage.setItem('categoryPost',null);
  }



  clearAccountInformation(){
    localStorage.setItem('showUserMenu', 'false');
    localStorage.setItem('email', '');
    localStorage.setItem('profile', null);
    localStorage.setItem('uToken',null);
  }

  
  checkEmpty(data: any, defaultValue) {
    if (data == null || data == '') {
      return defaultValue;
    } else {
      return data;
    }
  }

  onClick(rt, product, variants, quantity, productImage) {
    let total = (variants.price * quantity);
    let currPrd = {
      quantity: quantity,
      title: product.title,
      price: variants.price,
      image: productImage,
      total: total.toFixed(2),
      totalQuantity: variants.inventory_quantity,
      variantTitle: variants.title,
      variantId: variants.id,
      variantsGraphqlId: variants.admin_graphql_api_id
    }
    localStorage.setItem('currPrd', JSON.stringify(currPrd));
    this.navigate(rt);
  }

  navigate(rt,params?) {
   let routing;
    if(params!=null){
      routing=[rt,params];
    }else{
      routing=[rt];
    }
    this.router.navigate(routing)
      .then(() => {
      //  window.location.reload();
      });
  }
}