export interface Member {
  id: number;
  charisma: number;
  experience: number;
  innocence: number;
  money: number;
  active: boolean;
  
  recruited?: Member[];
}