"use client";

import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@wazo/convex-api/api";
import { Id } from "@wazo/convex-api/dataModel";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, ShieldCheck } from "lucide-react";

export default function PetDetailsPage({
  params,
}: {
  params: { id: Id<"ads"> };
}) {
  const ad = useQuery(api.functions.ads.getAdById, {
    id: params.id as Id<"ads">,
  });

  // Loading state
  if (ad === undefined) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        Loading pet details...
      </div>
    );
  }

  // Not found
  if (ad === null) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        Ad not found
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* LEFT */}
      <div className="lg:col-span-2 space-y-6">
        {/* Image Gallery */}
        <Card>
          <CardContent className="p-4">
            <div className="relative w-full h-[380px] rounded-lg overflow-hidden">
              <Image
                src={ad.images[0]}
                alt={ad.breed}
                fill
                className="object-cover"
              />
              <Badge className="absolute top-3 left-3 bg-black/60 text-white">
                1 / {ad.images.length}
              </Badge>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 mt-4">
              {ad.images.map((img, i) => (
                <div
                  key={i}
                  className="relative w-20 h-20 border rounded-md overflow-hidden"
                >
                  <Image
                    src={img}
                    alt="thumbnail"
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Title */}
        <div>
          <h1 className="text-2xl font-semibold">
            {ad.age} year(s) {ad.animalType} • {ad.breed}
          </h1>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
            <Badge variant="secondary">Promoted</Badge>
            <span>
              📍 {ad.sellerCity}, {ad.sellerState}
            </span>
            <span>• ₦{ad.price}</span>
          </div>
        </div>

        {/* Details */}
        <Card>
          <CardContent className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <Detail label="Animal" value={ad.animalType} />
            <Detail label="Breed" value={ad.breed} />
            <Detail label="Age" value={`${ad.age} year(s)`} />
            <Detail label="Price" value={`₦${ad.price}`} />
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium mb-2">Store address</h3>
            <p className="text-sm text-muted-foreground">
              {ad.sellerAddress ?? "Address not provided"}
            </p>
          </CardContent>
        </Card>

        {/* Description */}
        {ad.description && (
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium mb-3">Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {ad.description}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* RIGHT */}
      <div className="space-y-6">
        {/* Safety */}
        <Card>
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-2 font-medium">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              Safety tips
            </div>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Avoid paying in advance</li>
              <li>• Meet seller in a public place</li>
              <li>• Inspect pet before payment</li>
              <li>• Pay only if satisfied</li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-medium">Contact Options</h3>

            <Button
              className="w-full gap-2"
              onClick={() => window.open(`tel:${ad.sellerPhone}`)}
            >
              <Phone className="w-4 h-4" />
              Call Seller
            </Button>

            <Button variant="secondary" className="w-full">
              Make an Offer
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground text-xs uppercase">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
