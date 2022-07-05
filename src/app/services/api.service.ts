import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  product: any;
  constructor(private http: HttpClient) { }
  previousUrl;
  public isLoading = new BehaviorSubject(false);
  public userShortName = new BehaviorSubject("");
  public cartCount = new BehaviorSubject(0);
  public cartDetails = new BehaviorSubject({
    cartCountDetail :{
      qCount: 0,
      pCount: 0,
      subTotal: 0,
      note: ''
    },
    cartList : []
  });
  info;


  customerLogin(coustomer: any): Observable<any> {
    return this.http.post(environment.apiUrl + "Account/customerLogin", coustomer);
  }

  customerRecover(_email): Observable<any> {
    return this.http.post(environment.apiUrl + "Account/customerRecover", _email);
  }


  getCheckoutData(checkoutId: string): Observable<any> {
    return this.http.get(environment.apiUrl + `Products/getCheckoutData/${checkoutId}`);
  }

  createCheckout(checkoutdetail: any): Observable<any> {
    return this.http.post(environment.apiUrl + "Products/createCheckout", checkoutdetail);
  }

  createCart(checkoutdetail: any): Observable<any> {
    return this.http.post(environment.apiUrl + "Products/createCart", checkoutdetail);
  }

  getCartData(cartId: string): Observable<any> {
    return this.http.get(environment.apiUrl + `Products/getCartData/${cartId}`);
  }

  getCustomerDetailsByEmail(email: string): Observable<any> {
    return this.http.get(environment.apiUrl + `Customer/getCustomerDetailsByEmail/${email}`);
  }

  addComment(data: any): Observable<any> {
    return this.http.post(environment.apiUrl + "Customer/addComment", data);
  }

  public fileUpload(context: string, fileToUpload): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return this.http.post<any>(environment.apiUrl + context, formData);
  }
  compressImg(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      console.log("file", file);
      img.src = URL.createObjectURL(file);
      console.log("file img src", img.src);
      img.onload = () => {
        console.log('img loaded', file.size);
        const d = this.findImageDimension(img.naturalWidth, img.naturalHeight);
        console.log("d", d);
        if (d.quality !== 2) {
          const destinationCanvas = document.createElement('canvas');
          destinationCanvas.width = d.width;
          destinationCanvas.height = d.height;
          const ctx = destinationCanvas.getContext('2d') as CanvasRenderingContext2D;
          ctx.drawImage(img, 0, 0, d.width, d.height);
          ctx.canvas.toBlob(blob => {
            const ufile = new File([blob], file.name, { type: file.type, lastModified: Date.now() });
            resolve(ufile);
          }, 'image/jpeg', d.quality);
        } else {
          resolve(file)
        }
      }
    })
  }

  findImageDimension(actualWidth: number, actualHeight: number) {
    const maxHeight = 800;
    const maxWidth = 1000;
    let imgRatio = actualWidth / actualHeight;
    const maxRatio = maxWidth / maxHeight;
    const compressQuality = 1;
    if (actualHeight > maxHeight || actualWidth > maxWidth) {
      if (imgRatio < maxRatio) {
        imgRatio = maxHeight / actualHeight;
        actualWidth = imgRatio * actualWidth;
        actualHeight = maxHeight;
      } else if (imgRatio > maxRatio) {
        imgRatio = maxWidth / actualWidth;
        actualHeight = imgRatio * actualHeight;
        actualWidth = maxWidth;
      } else {
        actualHeight = maxHeight;
        actualWidth = maxWidth;
      }
      return {
        width: actualWidth,
        height: actualHeight,
        quality: compressQuality
      };
    } else {
      return {
        width: actualWidth,
        height: actualHeight,
        quality: 2
      };
    }
  }

  getCollections(): Observable<any> {
    /* return this.http.get<any>(environment.apiUrl + `Products/getCollections`)
       .pipe(
         tap(_ => this.log('fetch Collections info')),
         catchError(this.handleError("getCollections", ""))
       );*/
    return this.http.get(environment.apiUrl + `Products/getCollections`);
  }

  getProducts(collectionId: string): Observable<any> {
    return this.http.get(environment.apiUrl + `Products/getProducts/${collectionId}`);
  }

  getProductDetails(productName: string): Observable<any> {
    return this.http.get(environment.apiUrl + `Products/getProductDetails/${productName}`);
  }

  getProductDetailsById(productId: number): Observable<any> {
    return this.http.get(environment.apiUrl + `Products/getProductDetailsById/${productId}`);
  }

  getVariantList(ids: any): Observable<any> {
    return this.http.get(environment.apiUrl + `Products/getVariantList/${ids}`);
  }

  getCountries(): Observable<any> {
    return this.http.get(environment.apiUrl + `Customer/getCountries`);
  }

  getStates(country: string): Observable<any> {
    return this.http.get(environment.apiUrl + `Customer/getStates/${country}`);
  }

  getZipCodeDetail(countryCode, zipCode): Observable<any> {
    return this.http.get('https://api.worldpostallocations.com/pincode?'
      + `postalcode=${zipCode}&countrycode=${countryCode}`).pipe(tap(_ => this.log('fetch getTemplates in recruiter info')),
        catchError(this.handleError("getTemplates", "")));
  }

  getCustomerDetails(id: string): Observable<any> {
    return this.http.get(environment.apiUrl + `Customer/getCustomerDetails/${id}`);
  }

  getOrderDetails(id: string): Observable<any> {
    return this.http.get(environment.apiUrl + `Customer/getOrderDetail/${id}`);
  }

  addCustomer(data: Object): Observable<any> {
    return this.http.post<any>(environment.apiUrl + "Customer/addCustomer", data);
  }

  inviteActivateAccount(data: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + "Account/inviteActivateAccount", data);
  }

  updateAccount(data: Object): Observable<any> {
    return this.http.post<any>(environment.apiUrl + "Account/updateAccount", data);
  }

  updateAccountAddress(data: Object): Observable<any> {
    return this.http.post<any>(environment.apiUrl + "Account/updateAccountAddress", data);
  }

  deleteAccountAddress(data: Object): Observable<any> {
    return this.http.post<any>(environment.apiUrl + "Account/deleteAccountAddress", data);
  }

  subscribeNewsletter(email: string): Observable<any> {
    return this.http.post<any>(environment.apiUrl + `Customer/subscribeNewsletter/${email}`, email);
  }

  getIP(): Observable<any> {
    return this.http.get<any>("https://jsonip.com")
    .pipe(
      tap(_ => this.log('fetch IP info')),
      catchError(this.handleError("getIP", ""))

    );
  }

  sendFeedback(data: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + "contact-us/sendFeedback", data)
      .pipe(
        tap(_ => this.log('fetch sendFeedback info')),
        catchError(this.handleError("sendFeedback", ""))

      );
  }

  getInstaPost(): Observable<any> {
    return this.http.get(environment.apiUrl + `Products/getInstaPost`);
  }

  getProductReview(id: string, pageNo, pageSize): Observable<any> {
    return this.http.get<any>(environment.apiUrl + `Products/getProductReview/${id}/${pageSize}/${pageNo}`);
  }
  addProductReview(data: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + `Products/addProductReview`, data);
  }
  getCancelOrder(data: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + `Products/cancelOrder`, data);
  }

  getInstaData(): Observable<any> {
   /*  const IG_API_URL = "https://www.instagram.com/graphql/query/";

    // The `query_hash` value from before.
    const TIMELINE_QUERY_HASH = "d4d88dc1500312af6f937f7b804c68c3";
    // The number of images to fetch per page.
    const IMAGES_PER_PAGE = 4;
    
      const variables = {"id":"48077355138","first":IMAGES_PER_PAGE};
      const api = axios.create();
      const resp =  api.get(IG_API_URL, {
        params: {
          "query_hash": TIMELINE_QUERY_HASH,
          "variables": JSON.stringify(variables)
        }
      });
      console.log(resp);
      return ; */
    
    
    //return this.http.get(`https://www.instagram.com/accounts/login?username=9mmenergydrink1&password=Usa$123456`);
   // return this.http.get("https://www.instagram.com/9mmenergydrink1/?__a=1");
    //  return this.http.get("https://api.instagram.com/v1/users/48077355138/media/recent/?access_token=AQBMWWTVaWXuqJ2dDR-Hux17oXGkIf2RrXcx2L3OijuNXehl7gODJ31vVkxM1mwPLr6K-YAbtylF8eNjjWgeBrL_yexSCZo2IG73H1UY9iVQ-N0UmCtkdcoIPPSeiPYlgZtloB5whnq9t4fP9RsIFc8W-m0QmQynlfqYiQC1YCFrXgy7i_sDodFRdM6EDFwwjcv1T9LIdJ6LCbnWLrQc39GwEw4pa8942RcgRd9zac1fRw#_");
    /*   const body = new HttpParams()
    .set('client_id', '3979755122071499')
    .set('client_secret', '09599abc01858a44d1e31088113d41c7')
    .set('grant_type', 'authorization_code')
    .set('redirect_uri', 'https://github.com/')
    .set('code', '')

    return this.http.post('https://api.instagram.com/oauth/access_token',
    body.toString(),
    {
        headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
    }
    );  */
    return this.http.get<any>("https://api.instagram.com/oauth/authorize?client_id=3979755122071499&redirect_uri=https://oceanwp.org/instagram/&scope=user_profile,user_media&response_type=code")
    // return this.http.get("https://api.instagram.com/oauth/authorize?client_id=3979755122071499&redirect_uri=http://app.9mmenergydrink.s3-website.us-east-2.amazonaws.com&response_type=token")
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (e: any): Observable<T> => {
      console.log(e);
      return of(result as T);
    }
  }
  private log(error: any) {
    console.log(error);
  }
}
