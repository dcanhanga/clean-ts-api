import { type Collection, MongoClient, type ObjectId } from 'mongodb';

export abstract class MongoHelper {
  private static client: MongoClient | null = null;

  private constructor() {}

  public static async connect(url: string): Promise<void> {
    if (!MongoHelper.client) {
      MongoHelper.client = await MongoClient.connect(url);
    }
  }

  public static async disconnect(): Promise<void> {
    if (MongoHelper.client !== null) {
      await MongoHelper.client.close();
      MongoHelper.client = null;
    }
  }

  public static getCollection(name: string): Collection {
    if (MongoHelper.client === null) {
      throw new Error('Not connected to the database.');
    }
    return MongoHelper.client.db().collection(name);
  }

  public static map<T>(collection: unknown): T {
    const isKeyValueObject =
      collection !== null &&
      typeof collection === 'object' &&
      !Array.isArray(collection) &&
      typeof collection !== 'function';
    if (isKeyValueObject) {
      const { _id, ...collectionWithoutId } = collection as { _id: ObjectId };
      return { ...collectionWithoutId, id: _id.toString() } as unknown as T;
    }
    throw new Error('The provided collection is not a valid object.');
  }
}
