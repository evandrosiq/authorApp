import { Author } from "@/general";


export function getAll(): Author[] {
  try {
    const storedItems = localStorage.getItem("items");
    return storedItems ? JSON.parse(storedItems) : [];
  } catch (error) {
    console.error("Failed to get all items:", error);
    return [];
  }
}

export function create(props: { item: Author; callback: () => void; callbackError: () => void }): void {
  const { item, callback, callbackError } = props;
  try {
    const items = getAll();
    items.push(item);
    localStorage.setItem("items", JSON.stringify(items));
    callback()
  } catch (error) {
    console.error("Failed to create item:", error);
    callbackError()
  }
}

export function getById(id: string): Author | null {
  try {
    const items = getAll();
    return (
      items.find(function (item) {
        return item.id === id;
      }) || null
    );
  } catch (error) {
    console.error("Failed to get item by ID:", error);
    return null;
  }
}

export function update(id: string, authorData: Partial<Author>): void {
  try {
    const item = getById(id);
    if (item) {
      const updatedItem = {
        ...item,
        ...authorData,
        lastModify: new Date().toISOString(),
      };
      const items = getAll();
      const index = items.findIndex(function (existingItem) {
        return existingItem.id === id;
      });
      if (index !== -1) {
        items[index] = updatedItem;
        localStorage.setItem("items", JSON.stringify(items));
      }
    }
  } catch (error) {
    console.error("Failed to update item:", error);
  }
}

export function deleteItem(id: string): void {
  try {
    const items = getAll();
    const filteredItems = items.filter(function (item) {
      return item.id !== id;
    });
    localStorage.setItem("items", JSON.stringify(filteredItems));
  } catch (error) {
    console.error("Failed to delete item:", error);
  }
}

export function getLastModifiedDate() {
  const items = getAll();

  if (!items || items.length === 0) {
    return null;
  }

  const lastModifiedItem = items.reduce((latest, item) => {
    const itemLastModify = item.lastModify ? new Date(item.lastModify) : null;
    const latestLastModify = latest && latest.lastModify ? new Date(latest.lastModify) : null;

    if (!latest || (itemLastModify && (!latestLastModify || itemLastModify > latestLastModify))) {
      return item;
    }
    return latest;
  }, null as { lastModify?: string } | null);

  return lastModifiedItem ? lastModifiedItem.lastModify : null;
}