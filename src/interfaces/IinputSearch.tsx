export interface IinputSearch {
  type: string;
  placeholder: string;
  id: string;
  name: string;
  value: string;
  className: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
