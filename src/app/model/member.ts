export interface Member {
  id: number;
  // charisma: number;
  // experience: number;
  // innocence: number;
  money: number;
  active: boolean;
  week_joined: number;
  week_eliminated: number;
  children?: Member[];
}