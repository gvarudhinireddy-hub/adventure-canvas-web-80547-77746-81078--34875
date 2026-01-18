import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings, Globe, DollarSign, Check } from "lucide-react";
import { useCurrency, countries } from "@/hooks/useCurrency";
import { useLanguage, languages } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

export const GlobalSettings = () => {
  const { selectedCountry, setSelectedCountry } = useCurrency();
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2 text-foreground/70 hover:text-foreground"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{language.flag} {selectedCountry.symbol}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        {/* Language Selection */}
        <DropdownMenuLabel className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          {t('language')}
        </DropdownMenuLabel>
        <ScrollArea className="h-40">
          <div className="p-2 grid grid-cols-2 gap-1">
            {languages.map((lang) => (
              <Button
                key={lang.code}
                variant={language.code === lang.code ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "justify-start gap-2 h-9",
                  language.code === lang.code && "bg-primary/10 text-primary"
                )}
                onClick={() => setLanguage(lang)}
              >
                <span>{lang.flag}</span>
                <span className="text-xs truncate">{lang.nativeName}</span>
                {language.code === lang.code && <Check className="h-3 w-3 ml-auto" />}
              </Button>
            ))}
          </div>
        </ScrollArea>

        <DropdownMenuSeparator />

        {/* Currency Selection */}
        <DropdownMenuLabel className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          {t('currency')}
        </DropdownMenuLabel>
        <ScrollArea className="h-40">
          <div className="p-2 grid grid-cols-2 gap-1">
            {countries.map((country) => (
              <Button
                key={country.code}
                variant={selectedCountry.code === country.code ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "justify-start gap-2 h-9",
                  selectedCountry.code === country.code && "bg-primary/10 text-primary"
                )}
                onClick={() => setSelectedCountry(country)}
              >
                <span>{country.flag}</span>
                <span className="text-xs">{country.currency}</span>
                {selectedCountry.code === country.code && <Check className="h-3 w-3 ml-auto" />}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
