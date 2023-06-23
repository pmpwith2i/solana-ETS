// Flexible class that takes properties and imbues them
// to the object instance
class Assignable {
  constructor(properties: any) {
    Object.keys(properties).map((key) => {
      return (this[key as keyof typeof this] = properties[key]);
    });
  }
}

// Our instruction payload vocabulary
export class BorshPayload extends Assignable {}
