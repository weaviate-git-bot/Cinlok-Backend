import weaviate from "../service/weaviate";
// Command to migrate schema to Weaviate

// Create a class with the name "Person", with properties id, and tags (array of strings) and text2vec vectorizer
const personClass = {
  class: "Person",
  properties: [
    {
      name: "user_id",
      dataType: ["string"],
    },
    {
      name: "tags",
      dataType: ["string"],
    },
    {
      name: "channel",
      dataType: ["string"],
    }
  ],
  vectorizer: "text2vec-contextionary",
};

// Check if the class already exists
weaviate.schema
  .getter()
  .do()
  .then((res) => {
    // If the class does not exist, create it
    if (!res.classes?.find((e) => e.class === personClass.class)) {
      weaviate.schema
        .classCreator()
        .withClass(personClass)
        .do()
        .then((res) => {
          console.log(res.class);
          console.log("Class Created");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("Class already exists");
      // If class exists, check if the properties are the same, if not, delete the class and create it again
      const existingClass = res.classes?.find((e) => e.class === personClass.class);
      if (existingClass) {
        let same = true;
        personClass.properties.forEach((prop) => {
          if (!existingClass.properties?.find((e) => e.name === prop.name)) {
            same = false;
          }
        });

        // If not same, delete the class and create it again
        if (!same) {
          weaviate.schema.classDeleter().withClassName(personClass.class).do().then((_) => {
            weaviate.schema
              .classCreator()
              .withClass(personClass)
              .do()
              .then((res) => {
                console.log(res.class);
                console.log("Class Updated");
              })
              .catch((err) => {
                console.log(err);
              });
          });
        
        }
      }
    }
  });
