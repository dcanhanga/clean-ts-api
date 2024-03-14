import { type Collection, MongoClient, type ObjectId } from 'mongodb';

export abstract class MongoHelper {
  private static client: null | MongoClient = null;

  protected constructor() {}

  static async connect(url: string): Promise<void> {
    this.client = await MongoClient.connect(url);
  }

  static async disconnect(): Promise<void> {
    if (this.client !== null) {
      await this.client.close();
      this.client = null;
    }
  }

  static getCollection(name: string): Collection {
    if (this.client === null) {
      throw new Error('Não conectado ao banco de dados.');
    }
    return this.client.db().collection(name);
  }

  static map<T>(collection: unknown): T {
    const isKeyValueObject =
      collection !== null &&
      typeof collection === 'object' &&
      !Array.isArray(collection) &&
      typeof collection !== 'function';
    if (isKeyValueObject) {
      const { _id, ...collectionWithoutId } = collection as { _id: ObjectId };
      return { ...collectionWithoutId, id: _id.toString() } as unknown as T;
    }
    throw new Error('A coleção fornecida não é um objeto válido.');
  }
}
