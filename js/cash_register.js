/* 
Design a cash register drawer function checkCashRegister() that accepts purchase price as the first argument (price), payment as the second argument (cash), and cash-in-drawer (cid) as the third argument.

cid is a 2D array listing available currency.

The checkCashRegister() function should always return an object with a status key and a change key.

Return {status: "INSUFFICIENT_FUNDS", change: []} if cash-in-drawer is less than the change due, or if you cannot return the exact change.

Return {status: "CLOSED", change: [...]} with cash-in-drawer as the value for the key change if it is equal to the change due.

Otherwise, return {status: "OPEN", change: [...]}, with the change due in coins and bills, sorted in highest to lowest order, as the value of the change key.

Currency Unit	Amount
Penny	$0.01 (PENNY)
Nickel	$0.05 (NICKEL)
Dime	$0.1 (DIME)
Quarter	$0.25 (QUARTER)
Dollar	$1 (ONE)
Five Dollars	$5 (FIVE)
Ten Dollars	$10 (TEN)
Twenty Dollars	$20 (TWENTY)
One-hundred Dollars	$100 (ONE HUNDRED)

See below for an example of a cash-in-drawer array:
[
    ["PENNY", 1.01],
    ["NICKEL", 2.05],
    ["DIME", 3.1],
    ["QUARTER", 4.25],
    ["ONE", 90],
    ["FIVE", 55],
    ["TEN", 20],
    ["TWENTY", 60],
    ["ONE HUNDRED", 100]
]
*/

function checkCashRegister(price, cash, cid) {
    let change;
    let changeDue = cash - price;
    let totalCashInDrawer = 0;
    let changeArray = [];
    let currency = {
        "ONE HUNDRED": 100,
        "TWENTY": 20,
        "TEN": 10,
        "FIVE": 5,
        "ONE": 1,
        "QUARTER": 0.25,
        "DIME": 0.1,
        "NICKEL": 0.05,
        "PENNY": 0.01
    };

    for (let i = 0; i < cid.length; i++) {
        totalCashInDrawer += cid[i][1];
    }

    if (totalCashInDrawer < changeDue) {
        change = { status: "INSUFFICIENT_FUNDS", change: [] };
    } else if (totalCashInDrawer === changeDue) {
        change = { status: "CLOSED", change: cid };
    } else {
        for (let i = cid.length - 1; i >= 0; i--) {
            let currencyName = cid[i][0];
            let currencyValue = currency[currencyName];
            let currencyAmount = cid[i][1];
            let currencyTotal = 0;

            while (changeDue >= currencyValue && currencyAmount >= currencyValue) {
                changeDue -= currencyValue;
                changeDue = Math.round(changeDue * 100) / 100;
                currencyAmount -= currencyValue;
                currencyTotal += currencyValue;
            }

            if (currencyTotal > 0) {
                changeArray.push([currencyName, currencyTotal]);
            }
        }

        if (changeDue > 0) {
            change = { status: "INSUFFICIENT_FUNDS", change: [] };
        } else {
            change = { status: "OPEN", change: changeArray };
        }
    }

    return change;
}

console.log(checkCashRegister(19.5, 20, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]));