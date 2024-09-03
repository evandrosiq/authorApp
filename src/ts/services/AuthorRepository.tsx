export interface Author {
    id: string;
    title: string;
    typeOfWork: string;
    name: string;
    lastModify: string;
  }
  
  export function create(item: Author): void {
    try {
      const items = getAll();
      items.push(item);
      localStorage.setItem("items", JSON.stringify(items));
      console.log("Create ===> ", items);
      
    } catch (error) {
      console.error("Failed to create item:", error);
    }
  }
  
  export function getAll(): Author[] {
    try {
      const storedItems = localStorage.getItem("items");
      console.log("GetAll ===> ", storedItems);
      return storedItems ? JSON.parse(storedItems) : [];
    } catch (error) {
      console.error("Failed to get all items:", error);
      return [];
    }
  }
  
  export function getById(id: string): Author | null {
    try {
      const items = getAll();
      return items.find(function(item) {
        console.log("GetById ===> ",item );
        return item.id === id;
      }) || null;
    } catch (error) {
      console.error("Failed to get item by ID:", error);
      return null; 
    }
  }
  
  export function update(id: string, updatedData: Partial<Author>): void {
    try {
      const item = getById(id);
      if (item) {
        const updatedItem = { ...item, ...updatedData, lastModify: new Date().toISOString() };
        const items = getAll();
        const index = items.findIndex(function(existingItem) {        
          return existingItem.id === id;
        });
        if (index !== -1) {
          items[index] = updatedItem;
          localStorage.setItem("items", JSON.stringify(items));
          console.log("Update ===> ", items[index]);
        }
      }
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  }
  
  export function deleteItem(id: string): void {
    try {
      const items = getAll();
      const filteredItems = items.filter(function(item) {
        return item.id !== id;
      });
      console.log("Delete ===> ", filteredItems);
      localStorage.setItem("items", JSON.stringify(filteredItems));
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  }
  