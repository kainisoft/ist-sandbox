import DocumentSnapshot = firebase.firestore.DocumentSnapshot;

export interface Entity {
  id?: string | null;
  createdAt?: Date | null;
  ds?: DocumentSnapshot | null;
}
