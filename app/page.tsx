"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Printer, Barcode } from 'lucide-react';
import JsBarcode from 'jsbarcode';

export default function Home() {
  const [barcodeValue, setBarcodeValue] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (barcodeValue.length === 13) {
      try {
        JsBarcode("#barcodeCanvas", barcodeValue, {
          format: "EAN13",
          width: 2,
          height: 100,
          displayValue: true
        });
        setError('');
      } catch (e) {
        setError('Invalid EAN-13 code');
      }
    } else {
      setError('');
    }
  }, [barcodeValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '').slice(0, 13);
    setBarcodeValue(value);
  };

  const printBarcode = () => {
    const canvas = document.getElementById('barcodeCanvas') as HTMLCanvasElement;
    const dataUrl = canvas.toDataURL('image/png');
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Печать штрих-кода</title>
            <style>
              body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
              img { max-width: 100%; max-height: 100%; }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" onload="window.print();window.close()">
          </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      alert('Пожалуйста, разрешите всплывающие окна для этого сайта, чтобы напечатать штрих-код.');
    }
  };

  return (
    <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">EAN-13 Генератор штрих-кодов</CardTitle>
          <CardDescription className="text-center">Создавайте и печатайте EAN-13 штрих-коды</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ean13">Введите 13-значный EAN код:</Label>
              <Input
                id="ean13"
                placeholder="Например: 5901234123457"
                value={barcodeValue}
                onChange={handleInputChange}
                maxLength={13}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
            <div className="flex justify-center">
              <canvas id="barcodeCanvas"></canvas>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button
            onClick={printBarcode}
            disabled={barcodeValue.length !== 13 || error !== ''}
          >
            <Printer className="mr-2 h-4 w-4" /> Печать
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}