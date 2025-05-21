import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";

interface DrawerProps {
  children: React.ReactNode;
  isOpen: boolean;
  button: React.ReactNode;
  title?: string;
  onOpenChange: (open: boolean) => void;
}

export const CustomDrawer = ({
  children,
  isOpen,
  button,
  title,
  onOpenChange,
}: DrawerProps) => {
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{button}</DrawerTrigger>
      <DrawerContent className="mx-auto w-full bg-white px-2 py-8 md:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <DrawerHeader className="relative">
            <DrawerClose className="absolute right-0 top-0">
              <span className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                Close
              </span>
            </DrawerClose>
            {title && (
              <DrawerTitle className="text-black">
                <span className="header !pb-0">{title}</span>
              </DrawerTitle>
            )}
          </DrawerHeader>
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
