import { Button } from "@/components/ui/button";
import { BadgePlus, Download } from "lucide-react";
import { IconButtonConfig } from "@/components/layout/DashboardHeader";
import { ModalAgregarLuchador } from "@/components/luchadores/modals/ModalAgregarLuchador";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CardAgregarLuchador } from "@/components/luchadores/cards/CardAgregarLuchador";

export default function Luchadores() {
  return (
    <main className="flex flex-col gap-5">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <NativeSelect>
            <NativeSelectOption value="">Ordenar por</NativeSelectOption>
            <NativeSelectOption value="todo">Todo</NativeSelectOption>
            <NativeSelectOption value="in-progress">
              In Progress
            </NativeSelectOption>
            <NativeSelectOption value="done">Done</NativeSelectOption>
            <NativeSelectOption value="cancelled">Cancelled</NativeSelectOption>
          </NativeSelect>

          <NativeSelect>
            <NativeSelectOption value="">Filtros</NativeSelectOption>
            <NativeSelectOption value="todo">Todo</NativeSelectOption>
            <NativeSelectOption value="in-progress">
              In Progress
            </NativeSelectOption>
            <NativeSelectOption value="done">Done</NativeSelectOption>
            <NativeSelectOption value="cancelled">Cancelled</NativeSelectOption>
          </NativeSelect>

          <NativeSelect>
            <NativeSelectOption value="">Estado</NativeSelectOption>
            <NativeSelectOption value="todo">Todo</NativeSelectOption>
            <NativeSelectOption value="in-progress">
              In Progress
            </NativeSelectOption>
            <NativeSelectOption value="done">Done</NativeSelectOption>
            <NativeSelectOption value="cancelled">Cancelled</NativeSelectOption>
          </NativeSelect>

          <NativeSelect>
            <NativeSelectOption value="">Inactividad</NativeSelectOption>
            <NativeSelectOption value="todo">Todo</NativeSelectOption>
            <NativeSelectOption value="in-progress">
              In Progress
            </NativeSelectOption>
            <NativeSelectOption value="done">Done</NativeSelectOption>
            <NativeSelectOption value="cancelled">Cancelled</NativeSelectOption>
          </NativeSelect>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">
            <Download strokeWidth={IconButtonConfig.strokeWidth} />
            Exportar luchadores
          </Button>
          <ModalAgregarLuchador
            trigger={
              <Button>
                <BadgePlus strokeWidth={IconButtonConfig.strokeWidth} />
                Nuevo luchador
              </Button>
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-3 grid-rows-5 gap-4">
        <div className="col-span-2 row-span-3 flex flex-col gap-2.5"></div>
        <div className="row-span-2 col-start-3 flex flex-col gap-2.5">
          <CardAgregarLuchador />
          <CardAgregarLuchador />
          <CardAgregarLuchador />
          <CardAgregarLuchador />
        </div>
        <div className="row-span-3 col-start-3 row-start-3">
          <Card size="sm" className="w-full">
            <CardHeader>
              <CardTitle>Small Card</CardTitle>
              <CardDescription>
                This card uses the small size variant.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                The card component supports a size prop that can be set to
                &quot;sm&quot; for a more compact appearance.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                Action
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="col-span-2 row-start-4">
          {" "}
          <Card size="sm" className="w-full">
            <CardHeader>
              <CardTitle>Small Card</CardTitle>
              <CardDescription>
                This card uses the small size variant.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                The card component supports a size prop that can be set to
                &quot;sm&quot; for a more compact appearance.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                Action
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="row-start-5">
          <Card size="sm" className="w-full">
            <CardHeader>
              <CardTitle>Small Card</CardTitle>
              <CardDescription>
                This card uses the small size variant.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                The card component supports a size prop that can be set to
                &quot;sm&quot; for a more compact appearance.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                Action
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="row-start-5">
          {" "}
          <Card size="sm" className="w-full">
            <CardHeader>
              <CardTitle>Small Card</CardTitle>
              <CardDescription>
                This card uses the small size variant.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                The card component supports a size prop that can be set to
                &quot;sm&quot; for a more compact appearance.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                Action
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}
