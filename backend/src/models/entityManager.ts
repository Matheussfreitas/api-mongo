import mongoose, { Model, Schema } from 'mongoose';

interface IFieldDefinition {
    type: string;
    required?: boolean;
    unique?: boolean;
    ref?: string;
}

interface IEntityDefinition {
    name: string;
    fields: Record<string, IFieldDefinition>;
}

export default class EntityManager {
    private models: Map<string, Model<any>>;

    constructor() {
        this.models = new Map();
    }

    private convertFieldTypeToMongoose(field: IFieldDefinition): any {
        const typeMap: Record<string, any> = {
            'string': String,
            'number': Number,
            'boolean': Boolean,
            'date': Date,
            'objectId': mongoose.Schema.Types.ObjectId
        };

        const schemaField: any = {
            type: typeMap[field.type] || String
        };

        if (field.required) schemaField.required = true;
        if (field.unique) schemaField.unique = true;
        if (field.ref) schemaField.ref = field.ref;

        return schemaField;
    }

    async createEntity(entityDef: IEntityDefinition): Promise<Model<any>> {
        if (this.models.has(entityDef.name)) {
            throw new Error(`Entidade ${entityDef.name} já existe`);
        }

        // Convert fields to Mongoose schema
        const schemaFields: Record<string, any> = {};
        for (const [fieldName, fieldDef] of Object.entries(entityDef.fields)) {
            schemaFields[fieldName] = this.convertFieldTypeToMongoose(fieldDef);
        }

        // Add default timestamps
        const schema = new Schema(schemaFields, { timestamps: true });

        // Create model
        const model = mongoose.model(entityDef.name, schema);
        this.models.set(entityDef.name, model);

        return model;
    }

    getModel(entityName: string): Model<any> | undefined {
        return this.models.get(entityName);
    }

    getAllEntityNames(): string[] {
        return Array.from(this.models.keys());
    }
}