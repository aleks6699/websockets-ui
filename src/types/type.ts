export type usersType = {
  name: string;
  password: string;
}
export type responseUserType = {
  type: string;
  data: {
    name: string;
    index: number;
    error: boolean;
    errorText: string;
  };
  id: number;
}

export type requestUserType = {
  password: string;
  name: string;
  type: string;
  data: {
    name: string;
    password: string;
  };
  id: 0;
}
