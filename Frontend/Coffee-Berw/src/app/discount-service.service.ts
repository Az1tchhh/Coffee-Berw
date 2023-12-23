import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DiscountServiceService {
  private users: {userId:number, discountAvailable:boolean, purchaseDate:Date }[] = [];
  checkDiscountAvailability(userId: number): boolean {
    const user = this.users.find(user => user.userId === userId);
    if(!user){
      return true;
    }
    if (!user.discountAvailable) {
      return false;
    }
    if (user.purchaseDate) {
      const now = new Date();
      const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
      const elapsedTime = now.getTime() - user.purchaseDate.getTime();
      return elapsedTime >= oneWeekInMilliseconds;
    }

    return true;
  }

  purchaseDiscount(userId:number): void {

    const discountAvailable = false;
    const purchaseDate = new Date();
    this.users.push(
      {
        userId: userId,
        discountAvailable: discountAvailable,
        purchaseDate: purchaseDate
      }
    );
  }
}
