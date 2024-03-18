import { type Collection, MongoClient, type ObjectId } from 'mongodb';
/**
 * Utility class to provide access to the MongoDB database.
 * Maintains a single connection to MongoDB across the entire application.
 */
export abstract class MongoHelper {
  private static url: string | null;
  private static clientPromise: Promise<MongoClient> | null = null;
  /**
   * Private constructor to prevent class instantiation.
   */
  private constructor() {}
  /**
   * Connects to MongoDB.
   *
   * @param url Connection URL
   */
  private static async ensureClient(): Promise<MongoClient> {
    if (!MongoHelper.clientPromise) {
      if (!MongoHelper.url) {
        throw new Error('URL do MongoDB não definida');
      }
      MongoHelper.clientPromise = MongoClient.connect(MongoHelper.url);
    }
    return await MongoHelper.clientPromise;
  }

  public static async connect(url: string): Promise<void> {
    MongoHelper.url = url;
    await MongoHelper.ensureClient();
  }

  public static async disconnect(): Promise<void> {
    if (MongoHelper.clientPromise) {
      const client = await MongoHelper.clientPromise;
      await client.close();
      MongoHelper.clientPromise = null;
    }
  }

  /**
   * Gets a MongoDB collection by name.
   *
   * @param name Collection name
   * @returns Collection or an empty collection if an error occurs
   */
  public static async getCollection(name: string): Promise<Collection> {
    try {
      const client = await MongoHelper.ensureClient();
      return client.db().collection(name);
    } catch (err) {
      console.error('Erro ao obter coleção:', err);
      return await Promise.reject(err);
    }
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
