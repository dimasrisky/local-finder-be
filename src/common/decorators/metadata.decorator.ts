import 'reflect-metadata';

export function Relation(): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    const relations =
      (Reflect.getMetadata('relations', target) as (string | symbol)[]) || [];
    Reflect.defineMetadata('relations', [...relations, propertyKey], target);
  };
}
