// import { useState } from "react";
import { IFriend } from "../interfaces";

export default function FriendList({
  friends,
  selectedFriend,
  onSelectFriend,
}: {
  friends: IFriend[];
  selectedFriend: IFriend | null;
  onSelectFriend: {
    (friend: IFriend): void;
  };
}) {
  function handleSelectFriend(friend: IFriend) {
    onSelectFriend(friend);
  }

  return (
    <>
      {/* List of friends */}
      <ul>
        {friends.map((friend) => {
          let status =
            (friend.balance === 0 && "You and " + friend.name + " are even") ||
            (friend.balance > 0 && "You owe $" + Math.abs(friend.balance)) ||
            friend.name + " owes you $" + Math.abs(friend.balance);

          return (
            <li
              key={friend.id}
              className={friend.id === selectedFriend?.id ? "selected" : ""}
            >
              {/* Image */}
              <img src={friend.image} alt={friend.name} />
              <div>
                {/* Name */}
                <h3>{friend.name}</h3>

                {/* Status: who's owe and how much */}
                <p
                  className={
                    friend.balance > 0
                      ? "red" // You owe
                      : friend.balance < 0
                      ? "green" // Friend owes you
                      : "black" // Even
                  }
                >
                  {status}
                </p>
              </div>

              {/* Select this friend */}
              <button
                type="button"
                className="button"
                onClick={() => handleSelectFriend(friend)}
              >
                Select
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}
