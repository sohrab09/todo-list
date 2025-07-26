"use client";

import { useState } from "react";
import { Plus, Clock, Calendar, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { TodoItem } from "@/types/todo";
import { statusConfig } from "@/components/kanban/StatusConfig";

export default function KanbanBoard() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState({ title: "", description: "" });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const addTodo = () => {
    if (newTodo.title.trim() && newTodo.description.trim()) {
      const todo: TodoItem = {
        id: Date.now().toString(),
        title: newTodo.title,
        description: newTodo.description,
        status: "new",
        createdAt: new Date(),
      };
      setTodos((prev) => [
        todo,
        ...prev.filter((t) => t.status !== "new"),
        ...prev.filter((t) => t.status === "new"),
      ]);
      setNewTodo({ title: "", description: "" });
      setIsAddDialogOpen(false);
    }
  };

  const moveTodo = (
    id: string,
    newStatus: "new" | "ongoing" | "done",
    dueDate?: Date
  ) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id === id) {
          const updatedTodo = {
            ...todo,
            status: newStatus,
            ...(newStatus === "done" && { completedAt: new Date() }),
            ...(newStatus === "ongoing" && dueDate && { dueDate }),
            ...(newStatus !== "ongoing" && { dueDate: undefined }),
          };
          return updatedTodo;
        }
        return todo;
      })
    );
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) return;

    const statusMap: { [key: string]: "new" | "ongoing" | "done" } = {
      new: "new",
      ongoing: "ongoing",
      done: "done",
    };

    const newStatus = statusMap[destination.droppableId];
    if (newStatus === "ongoing") {
      const dueDate = new Date();
      dueDate.setHours(dueDate.getHours() + 24);
      moveTodo(draggableId, newStatus, dueDate);
    } else {
      moveTodo(draggableId, newStatus);
    }
  };

  const getTodosByStatus = (status: "new" | "ongoing" | "done") => {
    const filtered = todos.filter((todo) => todo.status === status);

    switch (status) {
      case "new":
        return filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "ongoing":
        return filtered.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "done":
        return filtered.sort((a, b) => {
          if (!a.completedAt || !b.completedAt) return 0;
          return (
            new Date(b.completedAt).getTime() -
            new Date(a.completedAt).getTime()
          );
        });
      default:
        return filtered;
    }
  };

  const getContextMenuOptions = (currentStatus: "new" | "ongoing" | "done") => {
    const allStatuses: ("new" | "ongoing" | "done")[] = [
      "new",
      "ongoing",
      "done",
    ];
    return allStatuses.filter((status) => status !== currentStatus);
  };

  const isOverdue = (todo: TodoItem) => {
    return (
      todo.status === "ongoing" &&
      todo.dueDate &&
      new Date(todo.dueDate) < new Date()
    );
  };

  const formatDueDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {(["new", "ongoing", "done"] as const).map((status) => (
          <div key={status} className="flex flex-col">
            {/* Column Header */}
            <div
              className={`rounded-t-2xl p-6 bg-gradient-to-r ${statusConfig[status].color} text-white shadow-lg`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                  <h2 className="text-xl font-bold">
                    {statusConfig[status].label}
                  </h2>
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white border-white/30 font-semibold"
                  >
                    {getTodosByStatus(status).length}
                  </Badge>
                </div>
                {status === "new" && (
                  <Dialog
                    open={isAddDialogOpen}
                    onOpenChange={setIsAddDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        className="bg-white/20 hover:bg-white/30 text-white border-white/30 h-9 w-9 p-0 rounded-full transition-all duration-200"
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-slate-800">
                          Create New Task
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6 pt-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700">
                            Task Title
                          </label>
                          <Input
                            value={newTodo.title}
                            onChange={(e) =>
                              setNewTodo((prev) => ({
                                ...prev,
                                title: e.target.value,
                              }))
                            }
                            placeholder="What needs to be done?"
                            className="h-12 text-lg border-2 focus:border-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700">
                            Description
                          </label>
                          <Textarea
                            value={newTodo.description}
                            onChange={(e) =>
                              setNewTodo((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            placeholder="Add more details about this task..."
                            rows={4}
                            className="text-base border-2 focus:border-blue-500 resize-none"
                          />
                        </div>
                        <Button
                          onClick={addTodo}
                          className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                        >
                          Create Task
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>

            {/* Column Content */}
            <Droppable droppableId={status}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 p-4 rounded-b-2xl transition-all duration-200 ${
                    statusConfig[status].bgColor
                  } ${
                    snapshot.isDraggingOver
                      ? "ring-2 ring-blue-400 ring-opacity-50 bg-blue-50"
                      : ""
                  } min-h-[500px] shadow-lg`}
                >
                  <div className="space-y-4">
                    {getTodosByStatus(status).map((todo, index) => (
                      <Draggable
                        key={todo.id}
                        draggableId={todo.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`transition-all duration-200 ${
                              snapshot.isDragging
                                ? "rotate-3 scale-105 shadow-2xl z-50"
                                : "hover:scale-[1.02] hover:shadow-lg"
                            }`}
                          >
                            <ContextMenu>
                              <ContextMenuTrigger>
                                <Card
                                  className={`cursor-pointer transition-all duration-200 border-2 ${
                                    isOverdue(todo)
                                      ? "border-red-400 bg-gradient-to-br from-red-50 to-pink-50 shadow-red-200"
                                      : "border-white/50 bg-white/70 backdrop-blur-sm hover:bg-white/90"
                                  } shadow-md hover:shadow-xl`}
                                >
                                  <CardContent className="p-5">
                                    {/* Task Header */}
                                    <div className="flex items-start justify-between mb-3">
                                      <h3 className="font-bold text-slate-800 text-lg leading-tight flex-1 mr-3">
                                        {todo.title}
                                      </h3>
                                      <div className="flex items-center gap-2">
                                        <Badge
                                          className={`${
                                            statusConfig[todo.status].badgeColor
                                          } text-white text-xs px-2 py-1 font-medium`}
                                        >
                                          {statusConfig[todo.status].label}
                                        </Badge>
                                        <MoreVertical className="h-4 w-4 text-slate-400" />
                                      </div>
                                    </div>

                                    {/* Task Description */}
                                    <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                                      {todo.description}
                                    </p>

                                    {/* Task Footer */}
                                    <div className="flex items-center justify-between text-xs">
                                      <div className="flex items-center gap-1 text-slate-500">
                                        <Calendar className="h-3 w-3" />
                                        <span>
                                          {new Intl.DateTimeFormat("en-US", {
                                            month: "short",
                                            day: "numeric",
                                          }).format(todo.createdAt)}
                                        </span>
                                      </div>

                                      {todo.status === "ongoing" &&
                                        todo.dueDate && (
                                          <div
                                            className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                                              isOverdue(todo)
                                                ? "bg-red-100 text-red-700 font-semibold"
                                                : "bg-amber-100 text-amber-700"
                                            }`}
                                          >
                                            <Clock className="h-3 w-3" />
                                            <span>
                                              Due {formatDueDate(todo.dueDate)}
                                            </span>
                                          </div>
                                        )}

                                      {todo.status === "done" &&
                                        todo.completedAt && (
                                          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                                            <span>
                                              ✓{" "}
                                              {formatDueDate(todo.completedAt)}
                                            </span>
                                          </div>
                                        )}
                                    </div>
                                  </CardContent>
                                </Card>
                              </ContextMenuTrigger>
                              <ContextMenuContent className="w-48">
                                {getContextMenuOptions(todo.status).map(
                                  (targetStatus) => (
                                    <ContextMenuItem
                                      key={targetStatus}
                                      onClick={() => {
                                        if (targetStatus === "ongoing") {
                                          const dueDate = new Date();
                                          dueDate.setHours(
                                            dueDate.getHours() + 24
                                          );
                                          moveTodo(
                                            todo.id,
                                            targetStatus,
                                            dueDate
                                          );
                                        } else {
                                          moveTodo(todo.id, targetStatus);
                                        }
                                      }}
                                      className="flex items-center gap-2 py-2"
                                    >
                                      <div
                                        className={`w-2 h-2 rounded-full bg-gradient-to-r ${statusConfig[targetStatus].color}`}
                                      ></div>
                                      Move to {statusConfig[targetStatus].label}
                                    </ContextMenuItem>
                                  )
                                )}
                              </ContextMenuContent>
                            </ContextMenu>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </div>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
