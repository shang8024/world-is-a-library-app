import React from 'react';
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';

interface CardWrapperType {
  children: React.ReactNode;
  cardTitle: string;
  cardDescription?: string;
  cardFooterLinkTitle?: string;
  cardFooterDescription?: string;
  cardFooterLink?: string;
  className?: string;
}

const CardWrapper = ({
  children,
  cardTitle,
  cardDescription,
  cardFooterLinkTitle = 'Learn More', // Default value
  cardFooterDescription = '',
  cardFooterLink,
  className = '',
}: CardWrapperType) => {
  return (
    <div className={cn("flex flex-col gap-6 items-center", className)}>
      <Card className='p-6 shadow-md w-md '>
        <CardHeader>
          <CardTitle className="text-2xl">{cardTitle}</CardTitle>
          {cardDescription && <CardDescription>{cardDescription}</CardDescription>}
        </CardHeader>
        <CardContent>{children}</CardContent>
        {cardFooterLink && (
          <div className="mt-4 text-center text-sm">
            {cardFooterDescription}{" "}
            <a href={cardFooterLink} className="underline underline-offset-4">
              {cardFooterLinkTitle}
            </a>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CardWrapper;