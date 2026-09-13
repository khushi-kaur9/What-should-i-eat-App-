import React, { useState } from 'react';
import { 
  ShoppingCart, Check, Trash2, Plus, ArrowRight, 
  Copy, CheckCheck, Sparkles, ChefHat, RotateCcw 
} from 'lucide-react';
import { ShoppingItem } from '../types';

interface ShoppingListViewProps {
  items: ShoppingItem[];
  onToggleItem: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onAddItem: (name: string) => void;
  onClearCompleted: () => void;
  onClearAll: () => void;
  onMoveToPantry: (itemNames: string[]) => void;
  onClose?: () => void;
}

export const ShoppingListView: React.FC<ShoppingListViewProps> = ({
  items,
  onToggleItem,
  onRemoveItem,
  onAddItem,
  onClearCompleted,
  onClearAll,
  onMoveToPantry,
}) => {
  const [newItemName, setNewItemName] = useState('');
  const [copied, setCopied] = useState(false);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    onAddItem(newItemName.trim());
    setNewItemName('');
  };

  const completedItems = items.filter(i => i.checked);
  const pendingItems = items.filter(i => !i.checked);

  const handleCopyList = () => {
    if (items.length === 0) return;
    const text = items
      .map(i => `${i.checked ? '[x]' : '[ ]'} ${i.name}${i.recipeName ? ` (for ${i.recipeName})` : ''}`)
      .join('\n');
    navigator.clipboard.writeText(`Shopping List - What Should I Eat?:\n${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMoveCheckedToPantry = () => {
    const names = completedItems.map(i => i.name);
    onMoveToPantry(names);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#ded8cb]">
        <div>
          <div className="flex items-center gap-2.5 text-[#2b2723]">
            <div className="w-10 h-10 rounded-xl bg-[#4a5e30] flex items-center justify-center text-white shadow-xs">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">Lista della Spesa</h1>
          </div>
          <p className="text-xs sm:text-sm text-[#7a7164] mt-1 font-sans">
            Missing ingredients you need from the grocery market
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {items.length > 0 && (
            <>
              <button
                id="btn-copy-shopping-list"
                onClick={handleCopyList}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#ede8df] hover:bg-[#e2dcd1] text-[#2b2723] transition-colors"
                title="Copy list to clipboard"
              >
                {copied ? <CheckCheck className="w-4 h-4 text-[#4a5e30]" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>

              <button
                id="btn-clear-all-shopping"
                onClick={onClearAll}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#b85d43] hover:bg-[#fbf0ec] border border-[#f3d9d0] transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Quick Add Custom Item Form */}
      <form onSubmit={handleAddSubmit} className="mb-6">
        <div className="flex items-center gap-2">
          <input
            id="input-custom-shopping-item"
            type="text"
            value={newItemName}
            onChange={e => setNewItemName(e.target.value)}
            placeholder="Add an item manually (e.g. olive oil, parmigiano, basil)..."
            className="flex-1 px-4 py-3 rounded-xl border border-[#ded8cb] bg-white text-sm font-medium text-[#2b2723] placeholder:text-[#9e9587] focus:outline-none focus:ring-2 focus:ring-[#4a5e30]/20 focus:border-[#4a5e30] shadow-2xs"
          />
          <button
            type="submit"
            id="btn-submit-shopping-item"
            disabled={!newItemName.trim()}
            className="flex items-center gap-1.5 px-5 py-3 bg-[#4a5e30] hover:bg-[#3d4f26] disabled:opacity-40 text-white rounded-xl text-xs sm:text-sm font-bold shadow-2xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>
      </form>

      {/* Transfer to Pantry Banner when items are checked */}
      {completedItems.length > 0 && (
        <div className="mb-6 p-4 rounded-2xl bg-[#edf2e8] border border-[#d5e0cd] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-2 text-[#344420] text-sm font-semibold">
            <Sparkles className="w-5 h-5 text-[#4a5e30] shrink-0" />
            <span>
              You bought {completedItems.length} item{completedItems.length === 1 ? '' : 's'}! Move them into your pantry?
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="btn-move-checked-to-pantry"
              onClick={handleMoveCheckedToPantry}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#4a5e30] hover:bg-[#3d4f26] text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <ChefHat className="w-4 h-4" />
              <span>Add to My Pantry</span>
            </button>
            <button
              onClick={onClearCompleted}
              className="px-3 py-2 text-xs font-medium text-[#7a7164] hover:text-[#2b2723]"
            >
              Clear Checked
            </button>
          </div>
        </div>
      )}

      {/* Items List */}
      {items.length === 0 ? (
        <div className="py-16 text-center bg-[#faf8f5] rounded-3xl border border-dashed border-[#ded8cb]">
          <div className="w-16 h-16 rounded-full bg-[#edf2e8] flex items-center justify-center text-[#4a5e30] mx-auto mb-3 shadow-inner">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#2b2723]">Your shopping list is clear!</h3>
          <p className="text-xs sm:text-sm text-[#7a7164] max-w-sm mx-auto mt-1">
            Whenever you find a recipe with missing ingredients, click "Add to Shopping List" to save them here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pending Items */}
          {pendingItems.length > 0 && (
            <div>
              <span className="text-xs font-bold text-[#7a7164] uppercase tracking-wider block mb-3">
                To Buy ({pendingItems.length})
              </span>
              <div className="space-y-2">
                {pendingItems.map((item) => (
                  <div
                    key={item.id}
                    id={`shopping-item-${item.id}`}
                    onClick={() => onToggleItem(item.id)}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-[#ded8cb] shadow-2xs hover:border-[#4a5e30]/60 transition-all cursor-pointer group select-none"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-md border border-[#c8bfaf] group-hover:border-[#4a5e30] flex items-center justify-center transition-colors bg-white"></div>
                      <div>
                        <span className="text-sm font-semibold text-[#2b2723] block capitalize">
                          {item.name}
                        </span>
                        {item.recipeName && (
                          <span className="text-[11px] text-[#7a7164] font-medium">
                            Needed for: <strong className="text-[#4a5e30]">{item.recipeName}</strong>
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveItem(item.id);
                      }}
                      className="p-1 text-[#a89f91] hover:text-[#b85d43] transition-colors"
                      title="Delete item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Items */}
          {completedItems.length > 0 && (
            <div>
              <span className="text-xs font-bold text-[#a89f91] uppercase tracking-wider block mb-3">
                Purchased ({completedItems.length})
              </span>
              <div className="space-y-2 opacity-70">
                {completedItems.map((item) => (
                  <div
                    key={item.id}
                    id={`shopping-item-done-${item.id}`}
                    onClick={() => onToggleItem(item.id)}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#f7f4ed] border border-[#ded8cb] transition-all cursor-pointer group select-none"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-md bg-[#4a5e30] text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="text-sm font-medium line-through text-[#8a8072] capitalize">
                        {item.name}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveItem(item.id);
                      }}
                      className="p-1 text-[#a89f91] hover:text-[#b85d43]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
