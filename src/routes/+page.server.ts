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
        "test1.meow",
        "test2.meow",
        "folder/test3.meow",
        "folder/folder/test4.meow",
      ],
      host: "dev",
    };
  }

  const meow = await platform.env.BUCKET.list();

  let objects: string[] = [];

  meow.objects.forEach((object: any) => {
    objects.push(object.key);
  });

  console.log(objects);

  return {
    items: objects,

    host: platform.env.HOST,
  };
}
