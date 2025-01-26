import { error } from "@sveltejs/kit";
import { dev } from "$app/environment";

export async function load({
  request,
  platform,
}: {
  request: any;
  platform: any;
}) {
  if (!platform?.env?.BUCKET) error(500, "No BUCKET found in platform.env");

  if (dev) {
    return {
      items: [
        {
          key: "test1.meow",
          size: 12000,
        },
        {
          key: "test2.meow",
          size: 12000,
        },

        {
          key: "folder/test3.meow",
          size: 12000,
        },

        {
          key: "folder/folder/test4.meow",
          size: 12000,
        },
      ],
      host: "dev",
    };
  }

  const meow = await platform.env.BUCKET.list();

  let objects: any[] = [];

  meow.objects.forEach((object: any) => {
    objects.push({ key: object.key, size: object.size });
  });

  console.log(objects);

  return {
    items: objects,

    host: platform.env.HOST,
  };
}
