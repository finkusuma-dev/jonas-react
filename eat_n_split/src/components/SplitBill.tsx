import { useState } from "react";
import { IFriend } from "../interfaces";

enum WhoIsPaying {
  you = "you",
  friend = "friend",
}

export default function SplitBill({
  selectedFriend,
  onSplitBill,
  onClose,
}: {
  selectedFriend: IFriend;
  onSplitBill: (bill: number) => void;
  onClose: () => void;
}) {
  const [bill, setBill] = useState<number>(0);
  const [yourExpense, setYourExpense] = useState<number>(0);
  const [friendExpense, setFriendExpense] = useState<number>(0);
  const [whoIsPaying, setWhoIsPaying] = useState<WhoIsPaying>(WhoIsPaying.you);

  function submit(e: React.MouseEvent) {
    e.preventDefault();
    onSplitBill(whoIsPaying === WhoIsPaying.you ? -friendExpense : yourExpense);
  }

  return (
    <>
      <form className="form-split-bill">
        {/* Close button */}
        <button type="button" className="button button-close" onClick={onClose}>
          X
        </button>

        {/* Title */}
        <h2>
          Split A Bill With <strong>{selectedFriend.name}</strong>
        </h2>

        {/* Edit Bill */}
        <label htmlFor="bill">😀 Bill value</label>
        <input
          id="bill"
          type="text"
          value={bill === 0 ? "" : bill}
          onChange={(e) => {
            // console.log("typeof e.target.value", typeof e.target.value);
            const aBill = Number(e.target.value) || 0;

            setBill(aBill);
            if (yourExpense !== null) {
              setFriendExpense(aBill - yourExpense);
            }
            // calculateBill();
          }}
        />

        {/* Edit your expense */}
        <label htmlFor="your-expense">😀 Your expense</label>
        <input
          id="your-expense"
          type="text"
          value={yourExpense === 0 ? "" : yourExpense}
          onChange={(e) => {
            const yourExpense = Number(e.target.value) || 0;
            setYourExpense(yourExpense);
            // calculateBill();
            setFriendExpense(bill - yourExpense);
          }}
        />

        {/* Edit friend's expense - calculated value & disabled */}
        <label htmlFor="friend-expense">
          😀 {selectedFriend.name}'s expense
        </label>
        <input id="friend-expense" type="text" value={friendExpense} disabled />

        {/* Select who is paying */}
        <label htmlFor="who-is-paying">🕶 Who's paying the bill</label>
        <select
          id="who-is-paying"
          value={whoIsPaying}
          onChange={(e) => {
            console.log("option selected", e.target.value);
            if (
              e.target.value === WhoIsPaying.you ||
              e.target.value === WhoIsPaying.friend
            ) {
              setWhoIsPaying(WhoIsPaying[e.target.value]);
            }
            // calculateBill();
          }}
        >
          {/* Whos is paying options */}
          <option key={WhoIsPaying.you} value={WhoIsPaying.you}>
            You
          </option>
          <option key={WhoIsPaying.friend} value={WhoIsPaying.friend}>
            {selectedFriend.name}
          </option>
          {/* -- */}
        </select>
        <div></div>

        {/* Submit */}
        <button type="submit" className="button" onClick={(e) => submit(e)}>
          Split Bill
        </button>
      </form>
    </>
  );
}
