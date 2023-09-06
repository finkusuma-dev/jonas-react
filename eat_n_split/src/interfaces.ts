export interface IFriend {
  id: number;
  name: string;
  image?: string;
  balance: number;
}

export interface IFriends extends Array<IFriend> {}
