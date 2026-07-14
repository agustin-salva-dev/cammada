import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MyBadge } from "@/components/ui/MyBadge";
import Image from "next/image";

export function CardAgregarLuchador() {
  return (
    <Card className="w-full p-2.5 gap-2.5">
      <CardHeader className="flex gap-2.5 items-center px-0">
        <Image
          src="https://github.com/shadcn.png"
          alt="Luchador PFP"
          width={80}
          height={80}
          className="rounded-md"
        ></Image>
        <div className="flex flex-col gap-1">
          <CardTitle className="text-md">
            Nombre <span className="text-primary">&quot;Apodo&quot;</span>{" "}
            Apellido
          </CardTitle>
          <CardDescription className="flex flex-col gap-2 w-full">
            <div className="flex justify-between gap-1.5">
              <MyBadge text="Peso ligero" variant="default" />
              <MyBadge text="Team Fenix" variant="default" />
            </div>
            <div className="flex gap-1 justify-between">
              <MyBadge text="Activo" variant="green" />
              <MyBadge text="26 anos" variant="outline" />
            </div>
            <div className="flex gap-1 justify-between">
              <MyBadge text="13 V" variant="secondary" />
              <MyBadge text="4 D" variant="secondary" />
              <MyBadge text="1 E" variant="secondary" />
            </div>
          </CardDescription>
        </div>
      </CardHeader>
      <CardFooter className="px-0">
        <Button variant="outline" size="sm" className="w-full">
          Agregar luchador
        </Button>
      </CardFooter>
    </Card>
  );
}
