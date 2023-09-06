import { useState } from "react";
import { IFriend } from "../interfaces";

export default function FormAddFriend({
  onAddFriend,
  onClose,
}: {
  onAddFriend: (newFriend: IFriend) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState<string>("");
  const [id] = useState<number>(Math.round(Math.random() * 100000));

  function handleClose(e: React.MouseEvent) {
    // e.preventDefault();
    setName("");
    onClose();
    // setIsAddNewFriend(false);
    // onFriendNameChange("");
  }

  function submit(e: React.MouseEvent) {
    e.preventDefault();

    onAddFriend({
      id: id,
      name: name,
      image: `https://i.pravatar.cc/48?u=${id}`,
      balance: 0,
    });

    setName("");
  }

  return (
    <div className="clear">
      <form className="form-add-friend">
        {/* Close button */}
        <button
          type="button"
          className="button button-close"
          onClick={(e) => handleClose(e)}
        >
          X
        </button>

        {/* Name */}
        <label htmlFor="name">😀Friend name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Image */}
        <label htmlFor="image-url">🕶Image url</label>
        <input
          id="image-url"
          type="text"
          value={`https://i.pravatar.cc/48?u=${id}`}
          readOnly
        />

        {/* Submit */}
        <button type="submit" className="button" onClick={(e) => submit(e)}>
          Add
        </button>
      </form>
    </div>
  );
}
