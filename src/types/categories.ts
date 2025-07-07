export type Category = {
  id: string;
  name: { [locale: string]: string };

  parent?: {
    id: string;
    typeId: string;
  };
};


export type ProductType ={
  id: string;
  name: string;
}