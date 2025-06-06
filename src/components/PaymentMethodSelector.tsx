
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Check } from "lucide-react";

interface PaymentMethodSelectorProps {
  onSelect: (method: string) => void;
  isLoading: boolean;
}

const PaymentMethodSelector = ({ onSelect, isLoading }: PaymentMethodSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
      <Card 
        className="cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => !isLoading && onSelect("pix")}
      >
        <CardContent className="p-4 flex flex-col items-center justify-center">
          {isLoading ? (
            <LoaderCircle className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <div className="w-16 h-16 flex items-center justify-center mb-2">
                <img 
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0zMjEuMTg4IDE0Mi4yNjZMMzgzLjc5NiA3OS42NTY0SDMxOS4xNDNMMjU2LjUzMiAxNDIuMjY2SDMyMS4xODhaIiBmaWxsPSIjMzI5OTREIi8+CjxwYXRoIGQ9Ik0xOTIuODcgMTQyLjI2NkgxMjguMjE3TDY1LjYwNTkgMjA0Ljg3OUgxMzAuMjU5TDE5Mi44NyAxNDIuMjY2WiIgZmlsbD0iIzMyOTk0RCIvPgo8cGF0aCBkPSJNMTI4LjIxNyAzNjkuNzM0SDE5Mi44N0wyNTUuNDg0IDMwNy4xMjNIMTkwLjgyOUwxMjguMjE3IDM2OS43MzRaIiBmaWxsPSIjMzI5OTREIi8+CjxwYXRoIGQ9Ik0zODMuNzk2IDIwNC44NzlMMzIxLjE4OCAyNjcuNDg5TDM4My43OTYgMzMwLjFWMjA0Ljg3OVoiIGZpbGw9IiMzMjk5NEQiLz4KPHBhdGggZD0iTTEyOC4yMTcgMjA0Ljg3OUw2NS42MDU5IDI2Ny40ODlMMTI4LjIxNyAzMzAuMVYyMDQuODc5WiIgZmlsbD0iIzMyOTk0RCIvPgo8cGF0aCBkPSJNMjU2LjAwMiA3OS42NTY0TDE5My4zOTIgMTcuMDQ1OVY3OS42NTY0SDI1Ni4wMDJaIiBmaWxsPSIjMzI5OTREIi8+CjxwYXRoIGQ9Ik0yNTYuMDAyIDQzMi4zNDNMMTkzLjM5MiA0OTQuOTU0VjQzMi4zNDNIMjU2LjAwMloiIGZpbGw9IiMzMjk5NEQiLz4KPHBhdGggZD0iTTI1Ni41MzMgMzY5LjczNEwzMTkuMTQ0IDQzMi4zNDNIMzgzLjc5Nkw1NDYuMDA0IDI2Ny40ODlMMzgzLjc5NiAxMDIuNjMzSDI4NS43MTJMMjU2LjUzMyAxMzEuODE0VjM2OS43MzRaIiBmaWxsPSIjMzI5OTREIi8+CjxwYXRoIGQ9Ik0zODMuNzk2IDEwMi42MzNWNzkuNjU2NEgzMzguNjg0TDI1Ni4wMDMgMTYyLjM0QzI1Mi42MTEgMTY1LjczMiAyNDcuNzczIDE2NS43MzIgMjQ0LjM4MSAxNjIuMzRMMTI4LjIxNyA0Ni4xNzI5VjExMi43MjRIMTMwLjI2TDI0NC4zODEgMjI2Ljg0NEMyNTAuOTgxIDIzMy40NDYgMjUwLjk4MSAyNDQuMDgyIDI0NC4zODEgMjUwLjY4NEwxMzAuMjYgMzY0LjgwNkgxMjguMjE3VjQzMi4zNDNIMTkzLjM5MlY0ODMuNDc2QzE5My4zOTIgNDkwLjAwNyAxOTguNjc2IDQ5NS4yOTIgMjA1LjIwOCA0OTUuMjkySDI0NC4zODFDMjUwLjkxMiA0OTUuMjkyIDI1Ni4xOTYgNDkwLjAwNyAyNTYuMTk2IDQ4My40NzZWNDMyLjM0M0gzODMuNzk2VjQwOS4zNjZMMzI4LjIxOSAzNTMuNzg4QzMyNC44MjcgMzUwLjM5NSAzMjQuODI3IDM0NS41NTcgMzI4LjIxOSAzNDIuMTY1TDM4My43OTYgMjg2LjU4N1YyNDguMzkyTDMyOC4yMTkgMTkyLjgxM0MzMjQuODI3IDE4OS40MjEgMzI0LjgyNyAxODQuNTg0IDMyOC4yMTkgMTgxLjE5MkwzODMuNzk2IDEyNS42MTRDMZZ4Ljc5NiAxMDIuNjMzWiIgZmlsbD0iIzQ2N0E2NiIvPgo8cGF0aCBkPSJNMTkzLjM5MiA3OS42NTY0VjE2LjA0ODlDMTkzLjM5MiA5LjUxNzM1IDE4OC4xMDcgNC4yMzI0MiAxODEuNTc2IDQuMjMyNDJIMTQyLjQwM0MxMzUuODcyIDQuMjMyNDIgMTMwLjU4NyA5LjUxNzM1IDEzMC41ODcgMTYuMDQ4OVY3OS42NTY0SDE5My4zOTJaIiBmaWxsPSIjMzI5OTREIi8+CjxwYXRoIGQ9Ik0zODMuNzk2IDMzMC4xVjM5Mi43MTFMNDQ2LjQwNyAzMzAuMUgzODMuNzk2WiIgZmlsbD0iIzMyOTk0RCIvPgo8cGF0aCBkPSJNMTkwLjgyOSAzMDcuMTIzSDI1NS40ODRMMjQ0LjM4MSAyOTYuMDJDMjM0LjU2OSAyODYuMjA4IDIzNC41NjkgMjcwLjE0OCAyNDQuMzgxIDI2MC4zMzZMMjU2LjUzMyAyNDguMTgzSDEzOC4yMDJMMTkwLjgyOSAzMDcuMTIzWiIgZmlsbD0iIzQ2N0E2NiIvPgo8cGF0aCBkPSJNMzgzLjc5NiAxNzkuNzgzTDM3My45NTQgMTg5LjYyNkwzMzguMTE0IDE1My43ODRMMzUwLjI2NyAxNDEuNjMySDMyMS4xODhMMjQ0LjM4MSAyMTguNDRDMjM0LjU2OSAyMjguMjUyIDIzNC41NjkgMjQ0LjMxMiAyNDQuMzgxIDI1NC4xMjRMMjU2LjUzMyAyNjYuMjc3TDM0My44NTkgMTc5Ljc4M0g0NDYuNDA3TDM4My43OTYgMTE3LjE3MlYxNzkuNzgzWiIgZmlsbD0iIzQ2N0E2NiIvPgo8cGF0aCBkPSJNMzgzLjc5NiAzOTIuNzExSDMxOS4xNDNMMzgzLjc5NiA0NTcuMzY2VjM5Mi43MTFaIiBmaWxsPSIjMzI5OTREIi8+CjxwYXRoIGQ9Ik0xOTMuMzkyIDQzMi4zNDNIMTI4LjczOUw2NS4xMjg5IDM2OS43MzRIOC4xMzQwNEw2NS4xMjg5IDQyNi43MjZWNDk0Ljk1NEgxMjguNzM5TDE5My4zOTIgNDMyLjM0M1oiIGZpbGw9IiMzMjk5NEQiLz4KPC9zdmc+Cg==" 
                  alt="PIX" 
                  className="w-12 h-12"
                />
              </div>
              <span className="font-medium text-gray-800">PIX</span>
              <span className="text-xs text-gray-500 mt-1">Transferência instantânea</span>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card 
        className="cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => !isLoading && onSelect("card")}
      >
        <CardContent className="p-4 flex flex-col items-center justify-center">
          {isLoading ? (
            <LoaderCircle className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <div className="w-16 h-16 flex items-center justify-center mb-2">
                <svg 
                  width="40" 
                  height="40" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-gray-600"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <line x1="2" x2="22" y1="10" y2="10" />
                </svg>
              </div>
              <span className="font-medium text-gray-800">Cartão de Crédito</span>
              <span className="text-xs text-gray-500 mt-1">Pagamento online seguro</span>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card 
        className="cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => !isLoading && onSelect("boleto")}
      >
        <CardContent className="p-4 flex flex-col items-center justify-center">
          {isLoading ? (
            <LoaderCircle className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <div className="w-16 h-16 flex items-center justify-center mb-2">
                <svg 
                  width="40" 
                  height="40" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" stroke="#4B5563" strokeWidth="1.5"/>
                  <path d="M6 8V16" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M10 8V16" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M14 8V16" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M18 8V16" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="font-medium text-gray-800">Boleto</span>
              <span className="text-xs text-gray-500 mt-1">Vencimento em 3 dias</span>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentMethodSelector;
