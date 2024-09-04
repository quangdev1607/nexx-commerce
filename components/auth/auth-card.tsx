import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "../ui/separator";
import { BackButton } from "./back-button";
import Socials from "./social-accounts";

type CardWrapperProps = {
  children: React.ReactNode;
  cardTitle: string;
  backButtonHref: string;
  backButtonLabel: string;
  showSocials?: boolean;
};

export const AuthCard = ({
  children,
  cardTitle,
  backButtonHref,
  backButtonLabel,
  showSocials,
}: CardWrapperProps) => {
  return (
    <Card className="mb-2 w-full max-w-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>

      {showSocials && (
        <CardFooter className="flex-col justify-center">
          <Separator className="my-2" />
          <span className="text-black-500 mx-4 mb-2">or</span>
          <Socials />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton href={backButtonHref} label={backButtonLabel} />
      </CardFooter>
    </Card>
  );
};
