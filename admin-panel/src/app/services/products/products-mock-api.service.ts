import { inject, Injectable } from '@angular/core';
import { IProductsApiService } from './products-api.interface';
import { Maybe } from '@orderna/admin-panel/src/types/maybe';
import { QueryOptions } from '@orderna/admin-panel/src/types/query-options';
import { BehaviorSubject, map, Observable, of, throwError } from 'rxjs';
import {
  Data,
  filterItems,
  getItem,
} from '@orderna/admin-panel/src/utils/service';
import { PRODUCTS } from '../../data/products';
import {
  InventoryItemUsed,
  InventoryItemUsedCreateData,
  InventoryItemUsedUpdateData,
} from '../../model/inventory-item-used';
import {
  ModifierGroup,
  ModifierGroupCreateData,
  ModifierGroupUpdateData,
} from '../../model/modifier-group';
import {
  ModifierOption,
  ModifierOptionCreateData,
  ModifierOptionUpdateData,
} from '../../model/modifier-option';
import {
  IProduct,
  Product,
  ProductCreateData,
  ProductUpdateData,
} from '../../model/product';
import { Store } from '../../model/store';
import { StoresApiService } from '../../core/stores/stores-api.service';
import { INVENTORY_ITEMS_USED } from '../../data/inventory-items-used';
import {
  getRandomModifierGroupId,
  MODIFIER_GROUPS,
} from '../../data/modifier-groups';
import {
  getRandomModifierOptionId,
  MODIFIER_OPTIONS,
} from '../../data/modifier-options';
import { InventoryApiService } from '../inventory/inventory-api.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsMockApiService implements IProductsApiService {
  private modifierGroups: ModifierGroup[] = [...MODIFIER_GROUPS];
  private modifierOptions: ModifierOption[] = [...MODIFIER_OPTIONS];
  private inventoryItemsUsed: InventoryItemUsed[] = [...INVENTORY_ITEMS_USED];

  storesService = inject(StoresApiService);
  inventoryService = inject(InventoryApiService);

  data = {
    products: {
      items: [...PRODUCTS],
      queryOptions: { page: 1, perPage: 10 } as QueryOptions<IProduct>,
      subject: new BehaviorSubject<Maybe<Product[]>>(null),
      totalSubject: new BehaviorSubject<Maybe<number>>(null),
      totalAfterFilterSubject: new BehaviorSubject<Maybe<number>>(null),
    },
  };

  get productsData() {
    return this.data['products'] as Data<Product, IProduct>;
  }

  listProducts(storeId: number, categoryId?: number): Observable<any> {
    const store = this.storesService.storesData.items.find(
      (s) => s.id === storeId
    );
    if (!store) return of([]);

    const products = store.categories
      .filter(
        (category) => categoryId === undefined || category.categoryId === categoryId
      )
      .flatMap((category) => category.products);

    console.log('listProducts', products);
    return of(products.map((p) => this.addModifierGroupsToProduct(p)));
  }

  listProductsByCategories(
    storeId: number,
    categoryIds: number[]
  ): Observable<any> {
    const store = this.storesService.storesData.items.find(
      (s) => s.id === storeId
    );
    if (!store) return of([]);

    const products = store.categories
      .filter((category) => category.categoryId && categoryIds.includes(category.categoryId))
      .flatMap((category) => category.products);

    console.log('listProductsByCategories', products);
    return of(products.map((p) => this.addModifierGroupsToProduct(p)));
  }

  deleteInventoryItemsUsed(ids: InventoryItemUsed['id'][]) {
    for (const id of ids) {
      const index = this.inventoryItemsUsed.findIndex((i) => i.id === id);
      if (index !== -1) {
        this.inventoryItemsUsed.splice(index, 1);
      }
    }
  }

  // NOTE: Need storeId here because IProduct don't have a storeId
  // TODO: Remove storeId
  getInventoryItemsUsed(storeId: Store['id'], productId: Product['id']) {
    return this.inventoryItemsUsed.filter(
      (o) =>
        o.productId === productId &&
        // Know which store inventory item used is under by leveraging the fact
        // that each product in a store can have up to 10 dummy inventory items
        o.id <= storeId * productId * 10
    );
  }

  createInventoryItemsUsed(
    storeId: Store['id'],
    productId: Product['id'],
    inventoryItemsUsed: InventoryItemUsedCreateData[] = []
  ) {
    const currentInventoryItemUsedCount = this.getInventoryItemsUsed(
      storeId,
      productId
    ).length;
    const maxInventoryItemUsedId = storeId * productId * 10;

    for (const inventoryItemUsed of inventoryItemsUsed) {
      const inventoryItemId = inventoryItemUsed.inventoryItemId;
      const inventoryItem = this.inventoryService.inventoryData.items.find(
        (o) => o.id === inventoryItemId
      );
      if (!inventoryItem) {
        throw new Error(`No inventory item with ID ${inventoryItemId} found.`);
      }
      const inventoryItemUsedId = currentInventoryItemUsedCount + 1;

      if (inventoryItemUsedId > maxInventoryItemUsedId) {
        throw new Error(
          'Reached maximum inventory items used per product. Cannot create.'
        );
      }

      this.inventoryItemsUsed.push(
        InventoryItemUsed.fromJSON({
          ...inventoryItemUsed,
          id: currentInventoryItemUsedCount + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          productId,
          inventoryItem,
        })
      );
    }
  }

  updateInventoryItemsUsed(
    storeId: Store['id'],
    productId: Product['id'],
    newInventoryItemsUsed: InventoryItemUsedUpdateData[]
  ) {
    const oldInventoryItemsUsed = this.getInventoryItemsUsed(
      storeId,
      productId
    );

    const oldInventoryItemUsedIds = oldInventoryItemsUsed.map((i) => i.id);
    const newInventoryItemUsedIds = newInventoryItemsUsed.map((i) => i.id);

    const inventoryItemUsedIdsToDelete = oldInventoryItemUsedIds.filter(
      (id) => !newInventoryItemUsedIds.includes(id)
    );
    const inventoryItemsUsedToCreate = newInventoryItemsUsed.filter(
      (o) => o.id === undefined || o.id === null
    );
    const inventoryItemsUsedToUpdate = oldInventoryItemsUsed.filter((i) =>
      newInventoryItemUsedIds.includes(i.id)
    );

    this.deleteInventoryItemsUsed(inventoryItemUsedIdsToDelete);

    this.createInventoryItemsUsed(
      storeId,
      productId,
      inventoryItemsUsedToCreate as InventoryItemUsedCreateData[]
    );

    for (const oldInventoryItemUsed of inventoryItemsUsedToUpdate) {
      const newInventoryItemUsed = newInventoryItemsUsed.find(
        (o) => o.id === oldInventoryItemUsed.id
      );

      if (!newInventoryItemUsed) {
        throw new Error(
          `No inventory item used with ID ${oldInventoryItemUsed.id} found. Cannot update.`
        );
      }

      const newInventoryItemId = newInventoryItemUsed.inventoryItemId;
      const newInventoryItem =
        newInventoryItemId !== undefined
          ? this.inventoryService.inventoryData.items.find(
              (o) => o.id === newInventoryItemId
            )
          : undefined;

      const newQuantity = newInventoryItemUsed.quantity;

      const newInventoryItemUsedData = InventoryItemUsed.fromJSON({
        ...oldInventoryItemUsed,
        updatedAt: new Date(),
        ...(newInventoryItem !== undefined && {
          inventoryItemId: newInventoryItemId,
          inventoryItem: newInventoryItem,
        }),
        ...(newQuantity !== undefined && { quantity: newQuantity }),
      });
      this.deleteInventoryItemsUsed([oldInventoryItemUsed.id]);
      this.inventoryItemsUsed.push(newInventoryItemUsedData);
    }
  }

  createProduct(
    product: ProductCreateData,
    storeId: number,
    categoryId: number
  ): Observable<any> {
    const productId = this.productsData.items.length + 1;
    this.createInventoryItemsUsed(
      storeId,
      productId
    );

    const newProduct = Product.fromJSON({
      ...product,
      id: productId,
      createdAt: new Date(),
      updatedAt: new Date(),

      // Will add actual values when listProducts/getProduct is called
      modifiers: [],
      inventoryItems: [],
      modifiersCount: 0,
      total_record: 0,
      categoryCount: 0
    });

    // Add new product in productsData
    this.productsData.items.push(newProduct);

    // Add new product in storesData
    const store = this.storesService.storesData.items.find(
      (store) => store.id === storeId
    );
    if (store) {
      const category = store?.categories.find(
        (category) => category.categoryId === categoryId
      );
      if (category) {
        newProduct['category'] = category.categoryId!;
        category.products?.unshift(newProduct);
        return of(
          category.products.map((p) => this.addModifierGroupsToProduct(p))
        );
      } else {
        return throwError(
          'Category not found with id:' + categoryId + 'In store:' + storeId
        );
      }
    } else {
      return throwError('Store not found with id:' + storeId);
    }
  }

  updateProduct(
    product: ProductUpdateData,
    storeId: number,
    categoryId: number
  ): Observable<any> {
    const store = this.storesService.storesData.items.find(
      (store) => store.id === storeId
    );
    if (store) {
      const category = store.categories.find(
        (category) => category.categoryId === categoryId
      );
      if (category && category.products) {
        const index = category.products.findIndex((p) => p.id === product.id);
        if (typeof index === 'number' && index > -1) {
          this.updateInventoryItemsUsed(
            storeId,
            product.id,
            product.inventoryItems
          );
          const updatedProduct: IProduct = {
            ...category.products[index],
            ...product,
            updatedAt: new Date(),

            // Will add actual values when listProducts/getProduct is called
            inventoryItems: [],
          };
          category.products[index] = Product.fromJSON(updatedProduct);

          return of(
            category.products.map((p) => this.addModifierGroupsToProduct(p))
          );
        } else {
          return throwError('No product found with id:' + product.id);
        }
      } else {
        return throwError(
          'Category not found with id:' + categoryId + 'in store:' + storeId
        );
      }
    } else {
      return throwError('Store not found with id:' + storeId);
    }
  }

  // NOTE: Need storeId here because IProduct don't have a storeId
  // TODO: Remove storeId
  // Adds modifier groups and their options, and inventory items used to a product
  extendProduct(storeId: Store['id'], product: Product): Product {
    let extendedProduct = Product.fromJSON(product);
    extendedProduct = this.addInventoryItemsUsedToProduct(
      storeId,
      extendedProduct
    );

    // Note: Order is important. Modifier groups should be added first before options.
    extendedProduct = this.addModifierGroupsToProduct(extendedProduct);
    extendedProduct = this.addModifierOptionsToProduct(extendedProduct);

    return extendedProduct;
  }

  // NOTE: Need storeId here because IProduct don't have a storeId
  // TODO: Remove storeId
  addInventoryItemsUsedToProduct(
    storeId: Store['id'],
    product: Product
  ): Product {
    const inventoryItems = this.getInventoryItemsUsed(storeId, product.id);

    return Product.fromJSON({
      ...product,
      inventoryItems,
    });
  }

  addModifierGroupsToProduct(product: Product): Product {
    const modifiers = this.modifierGroups.filter(
      (g) => g.productId === product.id
    );

    const modifiersCount = modifiers.length;

    return Product.fromJSON({
      ...product,
      modifiers,
      modifiersCount,
    });
  }

  addModifierOptionsToProduct(product: Product): Product {
    const modifiers = product.modifiers.map((m) =>
      this.addOptionsToModifierGroup(m)
    );
    return Product.fromJSON({
      ...product,
      modifiers,
    });
  }

  addOptionsToModifierGroup(group: ModifierGroup): ModifierGroup {
    const options = this.modifierOptions.reduce((acc: ModifierOption[], o) => {
      if (o.groupId === group.id) {
        // Get option title
        const product = this.productsData.items.find(
          (p) => p.id === o.productId
        );
        if (!product) {
          throw new Error(`No product with ID ${o.productId} found.`);
        }

        acc.push(
          ModifierOption.fromJSON({
            ...o,
            title: product.title,
          })
        );
      }
      return acc;
    }, []);

    return ModifierGroup.fromJSON({
      ...group,
      options,
    });
  }

  deleteProduct(
    storeId: number,
    categoryId: number,
    productId: number
  ): Observable<any> {
    const store = this.storesService.storesData.items.find(
      (s) => s.id === storeId
    );
    let products!: any;
    if (store) {
      const category = store.categories.find((c) => c.categoryId === categoryId);
      if (category) {
        category.products = category.products?.filter(
          (p) => p.id !== productId
        );
        products = category.products;
      }
    }
    return of(products);
  }

  findAllProducts(): Observable<any> {
    let products = this.data.products.items;
    console.log('All products:', products);
    return of(products);
  }

  numberOfProducts(): Observable<any> {
    let count = this.data.products.items.length;
    return of(count);
  }

  // NOTE: Need storeId here because IProduct don't have a storeId
  // TODO: Remove storeId
  getProduct(
    storeId: Store['id'],
    productId: IProduct['id']
  ): Observable<Maybe<Product>> {
    return getItem(this.productsData, productId).pipe(
      map((product) => (product ? this.extendProduct(storeId, product) : null))
    );
  }

  getProducts(options: QueryOptions<IProduct>): Observable<Maybe<IProduct[]>> {
    return filterItems(this.productsData, options);
  }

  deleteProducts(
    storeId: number,
    categoryId: number,
    productIds: number[]
  ): Observable<any> {
    const store = this.storesService.storesData.items.find(
      (s) => s.id === storeId
    );
    let products!: any;
    if (store) {
      const category = store.categories.find((c) => c.categoryId === categoryId);
      if (category) {
        category.products = category.products?.filter(
          (p) => !productIds.includes(p.id)
        );
        products = category.products;
      }
    }
    return of(products);
  }

  deleteAllProducts(storeId: number, categoryId: number): Observable<any> {
    const store = this.storesService.storesData.items.find(
      (s) => s.id === storeId
    );
    let products!: any;
    if (store) {
      const category = store.categories.find((c) => c.categoryId === categoryId);
      if (category) {
        category.products = [];
        products = category.products;
      }
    }
    return of(products);
  }

  deleteAllProductExcept(
    storeId: number,
    categoryId: number,
    exceptProductIds: number[]
  ): Observable<any> {
    const store = this.storesService.storesData.items.find(
      (s) => s.id === storeId
    );
    let products!: any;
    if (store) {
      const category = store.categories.find((c) => c.categoryId === categoryId);
      if (category) {
        category.products = category.products?.filter((p) =>
          exceptProductIds.includes(p.id)
        );
        products = category.products;
      }
    }
    return of(products);
  }

  getModifierGroup(modifierGroupId: ModifierGroup['id']): ModifierGroup {
    const modifierGroup = this.modifierGroups.find(
      (m) => m.id === modifierGroupId
    );
    if (!modifierGroup) {
      throw new Error(`No modifier group with ID ${modifierGroupId} found.`);
    }
    return this.addOptionsToModifierGroup(modifierGroup);
  }

  createModifierGroup(
    data: ModifierGroupCreateData
  ): Observable<ModifierGroup> {
    console.log('createModifierGroup', data);
    const newModifierGroup = ModifierGroup.fromJSON({
      ...data,
      id: getRandomModifierGroupId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      options: [],
    });
    this.modifierGroups.push(newModifierGroup);

    this.createModifierOptions(newModifierGroup.id, data.options);

    return of(this.getModifierGroup(newModifierGroup.id));
  }

  updateModifierGroup(
    data: ModifierGroupUpdateData
  ): Observable<ModifierGroup> {
    const oldModifierGroup = this.modifierGroups.find((m) => m.id === data.id);
    if (!oldModifierGroup) {
      throw new Error(
        `No modifier group with ID ${data.id} found. Cannot update.`
      );
    }

    const newModifierGroup = ModifierGroup.fromJSON({
      ...oldModifierGroup,
      ...(data.productId !== undefined && { productId: data.productId }),
      ...(data.title !== undefined && { title: data.title }),
      ...(data.skuPlu !== undefined && { skuPlu: data.skuPlu }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.optionLimit !== undefined && { optionLimit: data.optionLimit }),
      ...(data.categoryIds !== undefined && { categoryIds: data.categoryIds }),
      updatedAt: new Date(),
      options: [],
    });

    this.deleteModifierGroup(data.id);
    this.modifierGroups.unshift(newModifierGroup);

    this.updateModifierOptions(newModifierGroup.id, data.options);

    return of(this.getModifierGroup(newModifierGroup.id));
  }

  deleteModifierGroup(id: ModifierGroup['id']) {
    const index = this.modifierGroups.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new Error(`No modifier group with ID ${id} found. Cannot delete.`);
    }
    const modifierOptionsToDelete = this.getModifierOptions(id).map(
      (o) => o.id
    );
    this.deleteModifierOptions(modifierOptionsToDelete);
    this.modifierGroups.splice(index, 1);

    return of(undefined);
  }

  getModifierOptions(modifierGroupId: ModifierGroup['id']) {
    return this.modifierOptions.filter((o) => o.groupId === modifierGroupId);
  }

  createModifierOptions(
    modifierGroupId: ModifierGroup['id'],
    modifierOptions: ModifierOptionCreateData[]
  ) {
    for (const modifierOption of modifierOptions) {
      const newModifierOption = ModifierOption.fromJSON({
        ...modifierOption,
        id: getRandomModifierOptionId(),
        createdAt: new Date(),
        updatedAt: new Date(),
        groupId: modifierGroupId,
        title: '',
      });
      this.modifierOptions.push(newModifierOption);
    }
  }

  deleteModifierOptions(ids: ModifierOption['id'][]) {
    this.modifierOptions = this.modifierOptions.filter(
      (o) => !ids.includes(o.id)
    );
  }

  updateModifierOptions(
    modifierGroupId: ModifierGroup['id'],
    newModifierOptions: ModifierOptionUpdateData[] = []
  ) {
    const oldModifierOptions = this.getModifierOptions(modifierGroupId);

    const oldModifierOptionIds = oldModifierOptions.map((i) => i.id);
    const newModifierOptionIds = newModifierOptions.map((i) => i.id);

    const modifierOptionIdsToDelete = oldModifierOptionIds.filter(
      (id) => !newModifierOptionIds.includes(id)
    );
    const newModifierOptionsToCreate = newModifierOptions.filter(
      (o) => o.id === undefined || o.id === null
    );
    const oldModifierOptionsToUpdate = oldModifierOptions.filter((i) =>
      newModifierOptionIds.includes(i.id)
    );

    this.deleteModifierOptions(modifierOptionIdsToDelete);

    this.createModifierOptions(
      modifierGroupId,
      newModifierOptionsToCreate as ModifierOptionCreateData[]
    );

    for (const oldModifierOption of oldModifierOptionsToUpdate) {
      const newModifierOption = newModifierOptions.find(
        (o) => o.id === oldModifierOption.id
      );

      if (!newModifierOption) {
        throw new Error(
          `No modifier option with ID ${oldModifierOption.id} found. Cannot update.`
        );
      }

      const { productId, customPrice } = newModifierOption;

      const updatedModifierOption = ModifierOption.fromJSON({
        ...oldModifierOption,
        updatedAt: new Date(),
        ...(productId && { productId }),
        ...(customPrice && { customPrice }),
      });
      this.deleteModifierOptions([oldModifierOption.id]);
      this.modifierOptions.unshift(updatedModifierOption);
    }
  }
}
