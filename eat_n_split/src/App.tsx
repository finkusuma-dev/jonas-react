import { useState } from "react";
import "./App.css";
// import Test from "./components/Test";
import { IFriend } from "./interfaces";
import { initialFriends } from "./data";
import FriendList from "./components/FriendList";
import FormAddFriend from "./components/FormAddFriend";
import SplitBill from "./components/SplitBill";

export default function App() {
  const [friends, setFriends] = useState<IFriend[]>(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState<IFriend | null>(null);
  const [isAddingFriend, setIsAddingFriend] = useState<boolean>(false);

  // show add friend form
  function handleClickAddFriend() {
    setIsAddingFriend(true);
  }

  // close add friend form
  function handleCloseAddFriend() {
    setIsAddingFriend(false);
  }

  // adding new friend
  function handleAddFriend(newFriend: IFriend) {
    setFriends((friends) => [...friends, newFriend]);
    setIsAddingFriend(false);
  }

  // select friend from friend list
  function handleSelectFriend(friend: IFriend) {
    setSelectedFriend(friend);
    setIsAddingFriend(false);
  }

  // splitting bill with the selected friend
  function handleSplitBill(bill: number) {
    setFriends((friends) =>
      friends.map((friend) => {
        if (friend.id === selectedFriend?.id) {
          return {
            ...friend,
            balance: friend.balance + bill,
          };
        } else {
          return friend;
        }
      })
    );
  }

  return (
    <div className="app">
      <div className="sidebar">
        {/* Adding new friend */}
        {isAddingFriend ? (
          <FormAddFriend
            onAddFriend={handleAddFriend}
            onClose={handleCloseAddFriend}
          />
        ) : selectedFriend === null ? (
          <ButtonAddFriend onClick={() => handleClickAddFriend()} />
        ) : null}

        <div className="clear" />

        {/* Friend list */}
        <FriendList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelectFriend={handleSelectFriend}
        />
      </div>

      {/* Split bill with the selected friend */}
      {selectedFriend !== null ? (
        <SplitBill
          key={selectedFriend.id}
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
          onClose={() => setSelectedFriend(null)}
        />
      ) : null}
    </div>
  );
}

function ButtonAddFriend({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="button" onClick={onClick}>
      Add Friend
    </button>
  );
}
