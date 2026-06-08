export interface User {
  name: string;
  balance: number;
  referredBy: string | null;
}

export const usersDatabase: Record<string, User> = {
  "0911223344": { name: "Abel Mesgana",  balance: 500,  referredBy: "0922334455" },
  "0922334455": { name: "Chala Kebede",  balance: 1000, referredBy: "0933445566" },
  "0933445566": { name: "Aster Bekele", balance: 2500, referredBy: null          },
};

export function distributeMlmCommission(buyerPhone: string, totalAmount: number): void {
  const user = usersDatabase[buyerPhone];
  if (!user) return;

  const parentId = user.referredBy;
  if (!parentId || !usersDatabase[parentId]) return;

  usersDatabase[parentId].balance += totalAmount * 0.05;

  const grandparentId = usersDatabase[parentId].referredBy;
  if (!grandparentId || !usersDatabase[grandparentId]) return;

  usersDatabase[grandparentId].balance += totalAmount * 0.02;

  const greatGrandparentId = usersDatabase[grandparentId].referredBy;
  if (!greatGrandparentId || !usersDatabase[greatGrandparentId]) return;

  usersDatabase[greatGrandparentId].balance += totalAmount * 0.01;
}
